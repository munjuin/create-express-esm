#!/usr/bin/env node

import * as p from '@clack/prompts';
import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

// ESM 환경에서 __dirname 구현
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function run() {
  console.clear();
  
  // 1. 시작 인사 (v1.2.4 버전 반영)
  p.intro(`${chalk.bgBlue.white(' create-express-esm ')} ${chalk.dim('v1.2.4')}`);

  try {
    // 2. 사용자 질문 그룹
    const project = await p.group(
      {
        projectName: () =>
          p.text({
            message: '프로젝트 이름을 입력하세요:',
            placeholder: 'my-app',
            validate: (value) => {
              if (value.length === 0) return '프로젝트 이름은 필수입니다!';
              if (fs.existsSync(path.join(process.cwd(), value))) return '해당 폴더가 이미 존재합니다.';
            },
          }),
        language: () =>
          p.select({
            message: '사용할 언어를 선택하세요:',
            options: [
              { value: 'js', label: 'JavaScript (ESM)' },
              { value: 'ts', label: 'TypeScript' },
            ],
          }),
        useTest: () =>
          p.confirm({
            message: 'Vitest 테스트 환경을 추가하시겠습니까?',
            initialValue: true,
          }),
        useDb: () =>
          p.confirm({
            message: 'Prisma ORM 및 데이터베이스 환경을 추가하시겠습니까?',
            initialValue: false,
          }),
        dbType: ({ results }) => {
          if (!results.useDb) return;
          return p.select({
            message: '사용할 데이터베이스를 선택하세요:',
            options: [
              { value: 'postgresql', label: 'PostgreSQL' },
              { value: 'mysql', label: 'MySQL' },
              { value: 'mariadb', label: 'MariaDB' },
              { value: 'mongodb', label: 'MongoDB (NoSQL)' },
            ],
          });
        },
      },
      {
        onCancel: () => {
          p.cancel('프로젝트 생성이 취소되었습니다.');
          process.exit(0);
        },
      }
    );

    const { projectName, language, useTest, useDb, dbType } = project;
    const targetPath = path.join(process.cwd(), projectName);
    const templatePath = path.join(__dirname, '../template', language);
    const commonPath = path.join(__dirname, '../template/common');

    // 3. 파일 구성 시작
    const s = p.spinner();
    s.start('프로젝트 템플릿을 생성하는 중...');

    // (1) 기본 언어 템플릿 복사 (js 또는 ts)
    await fs.copy(templatePath, targetPath);

    // (2) 도트 파일 변환 (_env -> .env 등)
    const dotFiles = ['gitignore', '_gitignore', '_env'];
    for (const f of dotFiles) {
      const oldPath = path.join(targetPath, f);
      if (await fs.pathExists(oldPath)) {
        const newName = f.startsWith('_') ? f.replace('_', '.') : `.${f}`;
        await fs.move(oldPath, path.join(targetPath, newName), { overwrite: true });
        // .env 파일 생성 시 .env.example도 같이 생성
        if (newName === '.env') {
          await fs.copy(path.join(targetPath, '.env'), path.join(targetPath, '.env.example'));
        }
      }
    }

    // 4. DB 선택 시 기능 병합 (Common 소스 복사)
    if (useDb) {
      // (1) Prisma & Docker 설정 복사
      await fs.ensureDir(path.join(targetPath, 'prisma'));
      await fs.copy(
        path.join(commonPath, 'prisma', `schema.prisma.${dbType}`),
        path.join(targetPath, 'prisma', 'schema.prisma')
      );
      await fs.copy(
        path.join(commonPath, `docker-compose.yml.${dbType}`),
        path.join(targetPath, 'docker-compose.yml')
      );

      // (2) ⭐ [핵심 수정] 언어별 Common 소스 코드 병합
      // template/common/src/js (또는 ts) 폴더 내부를 target/src로 병합 복사
      const commonSrcPath = path.join(commonPath, 'src', language);
      if (await fs.pathExists(commonSrcPath)) {
        await fs.copy(commonSrcPath, path.join(targetPath, 'src'), { 
          overwrite: true,
          errorOnExist: false 
        });
      }

      // (3) app.ts / app.js 에 코드 주입
      const mainFilePath = path.join(targetPath, `src/app.${language}`);
      if (await fs.pathExists(mainFilePath)) {
        let content = await fs.readFile(mainFilePath, 'utf-8');
        
        // 중복 주입 방지 체크
        if (!content.includes('userRoutes')) {
          const imports = [
            `import userRoutes from './routes/userRoutes.js';`,
            `import { errorHandler } from './middlewares/errorMiddleware.js';`
          ].join('\n');
          
          content = imports + '\n' + content;
          // express.json() 다음에 라우터 연결
          content = content.replace(/app\.use\(express\.json\(\)\);?/g, (match) => {
            return `${match}\napp.use('/api/users', userRoutes);`;
          });
          // export default 앞에 에러 핸들러 연결
          const errorMiddlewareCode = `\n// 전역 에러 핸들러\napp.use(errorHandler);\n`;
          content = content.replace(/export default app;?/g, `${errorMiddlewareCode}\nexport default app;`);
          
          await fs.writeFile(mainFilePath, content);
        }
      }

      // (4) .env 파일에 DB 타입별 DATABASE_URL 추가
      const envPath = path.join(targetPath, '.env');
      const dbUrls = {
        postgresql: 'postgresql://myuser:mypassword@localhost:5433/mydb?schema=public',
        mysql: 'mysql://root:mypassword@localhost:4306/mydb',
        mariadb: 'mysql://root:mypassword@localhost:5306/mydb',
        mongodb: 'mongodb://root:mypassword@localhost:27017/mydb?authSource=admin'
      };
      await fs.appendFile(envPath, `\n# Database Connection\nDATABASE_URL="${dbUrls[dbType]}"\n`);
    }

    // 5. package.json 동적 최적화
    const pkgPath = path.join(targetPath, 'package.json');
    const pkg = await fs.readJson(pkgPath);
    pkg.name = projectName;

    if (language === 'ts') {
      pkg.scripts.dev = "nodemon --exec tsx src/server.ts";
      pkg.devDependencies["tsx"] = "^4.7.0";
    }

    if (!useTest) {
      const configExt = language === 'ts' ? 'ts' : 'js';
      await fs.remove(path.join(targetPath, `vitest.config.${configExt}`));
      await fs.remove(path.join(targetPath, `src/app.test.${configExt}`));
      delete pkg.scripts.test;
      delete pkg.devDependencies.vitest;
      delete pkg.devDependencies.supertest;
    }

    if (useDb) {
      pkg.scripts["db:up"] = "docker-compose up -d";
      pkg.scripts["db:push"] = "prisma db push";
      pkg.dependencies["@prisma/client"] = "^5.0.0";
      pkg.devDependencies["prisma"] = "^5.0.0";
    }

    await fs.writeJson(pkgPath, pkg, { spaces: 2 });
    s.stop('프로젝트 파일 구성 완료!');

    // 6. 의존성 설치
    const installSpinner = p.spinner();
    installSpinner.start('의존성 패키지를 설치하는 중... (npm install)');
    try {
      execSync('npm install', { cwd: targetPath, stdio: 'ignore' });
      installSpinner.stop('설치 완료!');
    } catch (e) {
      installSpinner.stop(chalk.red('설치 실패 (수동으로 npm install을 실행해 주세요)'));
    }

    // 7. 마무리 안내
    let nextSteps = `cd ${projectName}\n`;
    if (useDb) {
      nextSteps += `${chalk.bold('npm run db:up')} (Docker 실행)\n`;
      nextSteps += `${chalk.bold('npm run db:push')} (DB 스키마 반영)\n`;
    }
    nextSteps += `npm run dev`;

    p.note(chalk.cyan(nextSteps), '시작하려면 다음 명령어를 입력하세요');
    p.outro(chalk.green('✨ 모든 준비가 끝났습니다. 즐거운 개발 되세요!'));

  } catch (error) {
    p.cancel(`오류 발생: ${error.message}`);
    process.exit(1);
  }
}

run();