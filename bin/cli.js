#!/usr/bin/env node

import { input, select } from '@inquirer/prompts'; // 현대적인 방식으로 교체
import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

// ESM에서 __dirname 사용하기 위한 설정
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1.2.0 버전 정보 및 메인 로직
async function run() {
  console.log(chalk.blue.bold('\n🚀 Create Express ESM 시작!\n'));

  try {
    // 1. 사용자 질문 (비동기 함수 방식으로 변경)
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

    const targetPath = path.join(process.cwd(), projectName);
    const templatePath = path.join(__dirname, '../template', language);

    // 2. 폴더 존재 여부 확인
    if (fs.existsSync(targetPath)) {
      console.error(chalk.red(`\n❌ 오류: '${projectName}' 폴더가 이미 존재합니다.`));
      process.exit(1);
    }

    // 3. 템플릿 복사
    console.log(chalk.cyan(`\n📂 [${language.toUpperCase()}] 템플릿을 복사하는 중...`));
    
    if (!fs.existsSync(templatePath)) {
      console.error(chalk.red(`\n❌ 오류: ${language} 템플릿 폴더를 찾을 수 없습니다.`));
      console.log(chalk.gray(`경로 확인: ${templatePath}`));
      process.exit(1);
    }

    await fs.copy(templatePath, targetPath);

    // 4. 도트 파일 변환 및 환경 설정
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
          const exampleEnvPath = path.join(targetPath, '.env.example');
          await fs.copy(newFilePath, exampleEnvPath);
        }
      }
    }
    
    // 5. package.json 프로젝트 이름 수정
    const pkgPath = path.join(targetPath, 'package.json');
    if (await fs.pathExists(pkgPath)) {
      const pkg = await fs.readJson(pkgPath);
      pkg.name = projectName;
      await fs.writeJson(pkgPath, pkg, { spaces: 2 });
    }
    
    console.log(chalk.green(`✅ 템플릿 구성 완료!`));

    // 6. 패키지 자동 설치
    console.log(chalk.yellow(`\n📦 패키지 자동 설치를 진행합니다... (npm install)`));
    
    execSync('npm install', { 
      cwd: targetPath, 
      stdio: 'inherit' 
    });

    console.log(chalk.green(`\n✨ 모든 설치가 완료되었습니다!`));
    console.log(chalk.white(`\n다음 명령어로 시작하세요:\n`));
    console.log(chalk.cyan(`   cd ${projectName}`));
    if (language === 'ts') {
      console.log(chalk.cyan(`   npm run dev (또는 npm run build)`));
    } else {
      console.log(chalk.cyan(`   npm run dev`));
    }
    console.log('\n');

  } catch (error) {
    if (error.name === 'ExitPromptError') {
      console.log(chalk.yellow('\n\n👋 설치를 중단했습니다.'));
    } else {
      console.error(chalk.red('\n❌ 오류 발생:'), error);
    }
  }
}

run();