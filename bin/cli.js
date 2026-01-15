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
  
  // 1. 시작 인사 (v1.2.2 버전 반영)
  p.intro(`${chalk.bgBlue.white(' create-express-esm ')} ${chalk.dim('v1.2.2')}`);

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
            message: 'Prisma ORM 및 전역 에러 핸들링을 추가하시겠습니까?',
            initialValue: false,
          }),
        // [New] DB 타입 선택 (useDb가 true일 때만 실행)
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
    s.start('프로젝트 템플릿을 복사하는 중...');

    // 기본 언어 템플릿 복사
    await fs.copy(templatePath, targetPath);

    // 도트 파일 변환 (_env -> .env 등)
    const renameMap = {
      'gitignore': '.gitignore',
      '_gitignore': '.gitignore',
      '_env': '.env'
    };

    for (const [oldName, newName] of Object.entries(renameMap)) {
      const oldFilePath = path.join(targetPath, oldName);
      if (await fs.pathExists(oldFilePath)) {
        await fs.move(oldFilePath, path.join(targetPath, newName), { overwrite: true });
        if (newName === '.env') {
          await fs.copy(path.join(targetPath, '.env'), path.join(targetPath, '.env.example'));
        }
      }
    }

    // 4. DB 및 에러 핸들링 선택 시 추가 파일 복사 및 코드 주입
    if (useDb) {
      // (1) Prisma 설정 및 Docker Compose 복사 (선택한 DB 타입에 맞춤)
      await fs.ensureDir(path.join(targetPath, 'prisma'));
      
      const prismaTemplate = `schema.prisma.${dbType}`;
      const dockerTemplate = `docker-compose.yml.${dbType}`;

      await fs.copy(
        path.join(commonPath, 'prisma', prismaTemplate), 
        path.join(targetPath, 'prisma', 'schema.prisma')
      );
      
      await fs.copy(
        path.join(commonPath, dockerTemplate), 
        path.join(targetPath, 'docker-compose.yml')
      );

      // (2) 소스 코드 복사 (기존 로직 유지)
      const sourceFolders = ['lib', 'services', 'controllers', 'routes', 'utils', 'middlewares'];
      for (const folder of sourceFolders) {
        const srcFolderPath = path.join(commonPath, 'src', folder);
        const destFolderPath = path.join(targetPath, 'src', folder);
        
        if (await fs.pathExists(srcFolderPath)) {
          await fs.ensureDir(destFolderPath);
          const files = await fs.readdir(srcFolderPath);
          for (const file of files) {
            if (file.endsWith(`.${language}`)) {
              await fs.copy(path.join(srcFolderPath, file), path.join(destFolderPath, file));
            }
          }
        }
      }

      // (3) app.ts / app.js 에 코드 주입
      const mainFilePath = path.join(targetPath, `src/app.${language}`);
      if (await fs.pathExists(mainFilePath)) {
        let content = await fs.readFile(mainFilePath, 'utf-8');
        const imports = [
          `import userRoutes from './routes/userRoutes.js';`,
          `import { errorHandler } from './middlewares/errorMiddleware.js';`
        ].join('\n');
        content = imports + '\n' + content;
        content = content.replace('app.use(express.json());', `app.use(express.json());\napp.use('/users', userRoutes);`);
        const errorMiddlewareCode = `\n// 전역 에러 핸들러\napp.use(errorHandler);\n`;
        content = content.includes('export default app;') 
          ? content.replace('export default app;', `${errorMiddlewareCode}\nexport default app;`)
          : content + `\n${errorMiddlewareCode}`;
        await fs.writeFile(mainFilePath, content);
      }

      // (4) .env 파일에 DB 타입별 DATABASE_URL 추가
      const envPath = path.join(targetPath, '.env');
      let dbUrlContent = '';
      
      if (dbType === 'postgresql') {
        dbUrlContent = `\n# PostgreSQL Connection\nDATABASE_URL="postgresql://myuser:mypassword@localhost:5433/mydb?schema=public"\n`;
      } else if (dbType === 'mysql') {
        dbUrlContent = `\n# MySQL Connection\nDATABASE_URL="mysql://root:mypassword@localhost:4306/mydb"\n`;
      } else if (dbType === 'mariadb') {
        dbUrlContent = `\n# MariaDB Connection\nDATABASE_URL="mysql://root:mypassword@localhost:5306/mydb"\n`; // 5306 사용
      } else if (dbType === 'mongodb') {
        dbUrlContent = `\n# MongoDB Connection\nDATABASE_URL="mongodb://root:mypassword@localhost:27017/mydb?authSource=admin"\n`;
      } 
      
      await fs.appendFile(envPath, dbUrlContent);
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
      delete pkg.scripts["test:ui"];
      delete pkg.scripts["test:run"];
      delete pkg.devDependencies.vitest;
      delete pkg.devDependencies.supertest;
    }

    if (useDb) {
      pkg.scripts["db:up"] = "docker-compose up -d";
      pkg.scripts["db:push"] = "prisma db push";
      pkg.scripts["prisma:generate"] = "prisma generate";
      pkg.scripts["prisma:studio"] = "prisma studio";
      pkg.dependencies["@prisma/client"] = "^5.0.0";
      pkg.devDependencies["prisma"] = "^5.0.0";
    }

    await fs.writeJson(pkgPath, pkg, { spaces: 2 });
    s.stop('파일 구성 완료!');

    // 6. 의존성 설치
    const installSpinner = p.spinner();
    installSpinner.start('의존성 패키지를 설치하는 중... (npm install)');
    try {
      execSync('npm install', { cwd: targetPath, stdio: 'ignore' });
      installSpinner.stop('설치 완료!');
    } catch (e) {
      installSpinner.stop(chalk.red('설치 실패 (수동 설치가 필요할 수 있습니다)'));
    }

    // 7. 마무리
    let nextSteps = `cd ${projectName}\n`;
    if (useDb) {
      nextSteps += `${chalk.bold('npm run db:up')} (DB 실행)\n`;
      nextSteps += `${chalk.bold('npm run db:push')} (테이블 생성)\n`;
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