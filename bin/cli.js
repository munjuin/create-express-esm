#!/usr/bin/env node

import { input, select, confirm } from '@inquirer/prompts';
import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function run() {
  console.log(chalk.blue.bold('\n🚀 Create Express ESM 시작!\n'));

  try {
    // 1. 사용자 질문
    const projectName = await input({
      message: '생성할 프로젝트 이름을 입력하세요:',
      default: 'my-app',
    });

    const language = await select({
      message: '사용할 언어를 선택하세요:',
      choices: [
        { name: 'JavaScript (ESM)', value: 'js' },
        { name: 'TypeScript', value: 'ts' },
      ],
    });

    const useTest = await confirm({
      message: 'Vitest 테스트 환경을 추가하시겠습니까?',
      default: true,
    });

    const targetPath = path.join(process.cwd(), projectName);
    const templatePath = path.join(__dirname, '../template', language);

    // 2. 폴더 존재 여부 확인
    if (fs.existsSync(targetPath)) {
      console.error(chalk.red(`\n❌ 오류: '${projectName}' 폴더가 이미 존재합니다.`));
      process.exit(1);
    }

    // 3. 기본 템플릿 복사
    console.log(chalk.cyan(`\n📂 [${language.toUpperCase()}] 템플릿 구성을 시작합니다...`));
    await fs.copy(templatePath, targetPath);

    // 4. 도트 파일 변환 (_env -> .env 등)
    const renameMap = {
      'gitignore': '.gitignore',
      '_gitignore': '.gitignore',
      '_env': '.env'
    };

    for (const [oldName, newName] of Object.entries(renameMap)) {
      const oldFilePath = path.join(targetPath, oldName);
      const newFilePath = path.join(targetPath, newName);
      if (await fs.pathExists(oldFilePath)) {
        await fs.move(oldFilePath, newFilePath, { overwrite: true });
        if (newName === '.env') {
          await fs.copy(newFilePath, path.join(targetPath, '.env.example'));
        }
      }
    }
    
    // 5. package.json 동적 수정
    const pkgPath = path.join(targetPath, 'package.json');
    const pkg = await fs.readJson(pkgPath);
    pkg.name = projectName;

    // [추가된 부분] TypeScript 환경에서 ESM 에러를 방지하기 위한 tsx 설정
    if (language === 'ts') {
      console.log(chalk.yellow(`⚙️  TypeScript ESM 실행 환경(tsx)을 최적화하는 중...`));
      
      // ts-node 대신 tsx를 사용하여 .js 확장자 임포트 문제 해결
      pkg.scripts.dev = "nodemon --exec tsx src/server.ts";
      
      // 의존성 교체
      pkg.devDependencies = {
        ...pkg.devDependencies,
        "tsx": "^4.7.0"
      };
      
      // 기존에 ts-node가 있다면 제거 (중복 방지)
      delete pkg.devDependencies['ts-node'];
    }

    // Vitest 설정 (이슈 #3 구현 부분)
    if (useTest) {
      console.log(chalk.yellow(`🧪 Vitest 설정 및 샘플 테스트를 생성하는 중...`));
      
      pkg.scripts = {
        ...pkg.scripts,
        "test": "vitest",
        "test:ui": "vitest --ui",
        "test:run": "vitest run"
      };

      const testDeps = {
        "vitest": "^1.0.0",
        "supertest": "^6.3.3"
      };

      if (language === 'ts') {
        testDeps["@types/supertest"] = "^2.0.12";
      }

      pkg.devDependencies = {
        ...pkg.devDependencies,
        ...testDeps
      };

      // Vitest 설정 파일 생성
      const configExt = language === 'ts' ? 'ts' : 'js';
      const configContent = `import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
  },
});`;
      await fs.writeFile(path.join(targetPath, `vitest.config.${configExt}`), configContent);

      // 샘플 테스트 파일 생성
      const testFileExt = language === 'ts' ? 'ts' : 'js';
      const testContent = `import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from './app.js';

describe('API Health Check Test', () => {
  it('GET / 요청이 성공해야 한다', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.text).toContain('Server is Running');
  });
});`;
      await fs.writeFile(path.join(targetPath, `src/app.test.${testFileExt}`), testContent);
    }

    await fs.writeJson(pkgPath, pkg, { spaces: 2 });
    console.log(chalk.green(`✅ 모든 구성 완료!`));

    // 6. 패키지 자동 설치
    console.log(chalk.yellow(`\n📦 의존성 패키지를 설치합니다... (npm install)`));
    execSync('npm install', { cwd: targetPath, stdio: 'inherit' });

    console.log(chalk.green(`\n✨ 프로젝트 생성 성공!`));
    console.log(chalk.white(`\n다음 명령어를 입력해 보세요:\n`));
    console.log(chalk.cyan(`   cd ${projectName}`));
    if (useTest) console.log(chalk.cyan(`   npm test`));
    console.log(chalk.cyan(`   npm run dev\n`));

  } catch (error) {
    if (error.name === 'ExitPromptError') { // 오타 수정: ExitPnromptError -> ExitPromptError
      console.log(chalk.yellow('\n\n👋 설치를 중단했습니다.'));
    } else {
      console.error(chalk.red('\n❌ 오류 발생:'), error);
    }
  }
}

run();