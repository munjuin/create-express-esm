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
  
  // 1. 시작 인사 (Intro)
  p.intro(`${chalk.bgBlue.white(' create-express-esm ')} ${chalk.dim('v1.1.9')}`);

  try {
    // 2. 사용자 질문 그룹 (Group)
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
      },
      {
        onCancel: () => {
          p.cancel('프로젝트 생성이 취소되었습니다.');
          process.exit(0);
        },
      }
    );

    const { projectName, language, useTest } = project;
    const targetPath = path.join(process.cwd(), projectName);
    const templatePath = path.join(__dirname, '../template', language);

    // 3. 파일 구성 시작 (Spinner)
    const s = p.spinner();
    s.start('프로젝트 템플릿을 복사하는 중...');

    // 템플릿 전체 복사 (Vitest 파일 포함)
    await fs.copy(templatePath, targetPath);

    // 도트 파일 변환 (예: _env -> .env)
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

    // 4. package.json 동적 최적화
    const pkgPath = path.join(targetPath, 'package.json');
    const pkg = await fs.readJson(pkgPath);
    pkg.name = projectName;

    // TypeScript 선택 시 실행 환경(tsx) 강제 설정
    if (language === 'ts') {
      pkg.scripts.dev = "nodemon --exec tsx src/server.ts";
      pkg.devDependencies["tsx"] = "^4.7.0";
      // 구형 ts-node 제거
      if (pkg.devDependencies["ts-node"]) delete pkg.devDependencies["ts-node"];
    }

    // 테스트 환경 사용 여부에 따른 처리
    const configExt = language === 'ts' ? 'ts' : 'js';
    const testFileExt = language === 'ts' ? 'ts' : 'js';

    if (!useTest) {
      // 사용자가 원치 않으면 복사된 테스트 파일 삭제
      await fs.remove(path.join(targetPath, `vitest.config.${configExt}`));
      await fs.remove(path.join(targetPath, `src/app.test.${testFileExt}`));

      // package.json에서 관련 설정 제거
      delete pkg.scripts.test;
      delete pkg.scripts["test:ui"];
      delete pkg.scripts["test:run"];
      delete pkg.devDependencies.vitest;
      delete pkg.devDependencies.supertest;
      if (pkg.devDependencies["@types/supertest"]) delete pkg.devDependencies["@types/supertest"];
    } else {
      // 사용자가 원하면 스크립트가 확실히 있는지 보장
      pkg.scripts.test = "vitest";
      pkg.scripts["test:ui"] = "vitest --ui";
    }

    await fs.writeJson(pkgPath, pkg, { spaces: 2 });
    s.stop('파일 구성 완료!');

    // 5. 의존성 설치 (Spinner)
    const installSpinner = p.spinner();
    installSpinner.start('의존성 패키지를 설치하는 중... (npm install)');
    
    try {
      execSync('npm install', { cwd: targetPath, stdio: 'ignore' });
      installSpinner.stop('설치 완료!');
    } catch (e) {
      installSpinner.stop(chalk.red('설치 실패 (수동 설치가 필요할 수 있습니다)'));
    }

    // 6. 마무리 (Note & Outro)
    p.note(
      chalk.cyan(`cd ${projectName}\n${useTest ? 'npm test\n' : ''}npm run dev`),
      '시작하려면 다음 명령어를 입력하세요'
    );

    p.outro(chalk.green('✨ 모든 준비가 끝났습니다. 즐거운 개발 되세요!'));

  } catch (error) {
    p.cancel(`오류 발생: ${error.message}`);
    process.exit(1);
  }
}

run();