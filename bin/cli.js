#!/usr/bin/env node

import { program } from 'commander';
import inquirer from 'inquirer';
import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

// ESM에서 __dirname 사용하기 위한 설정
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

program
  .version('1.1.0') // 이슈 해결을 반영하여 버전 상향
  .description('Layered Architecture 기반의 Modern Express 프로젝트 생성기');

program
  .action(async () => {
    console.log(chalk.blue.bold('\n🚀 Create Express ESM 시작!\n'));

    // 1. 사용자 질문
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'projectName',
        message: '생성할 프로젝트 이름을 입력하세요:',
        default: 'my-app',
      }
    ]);

    const { projectName } = answers;
    const targetPath = path.join(process.cwd(), projectName);
    const templatePath = path.join(__dirname, '../template');

    // 2. 템플릿 복사 및 환경 설정
    try {
      if (fs.existsSync(targetPath)) {
        console.error(chalk.red(`❌ 오류: '${projectName}' 폴더가 이미 존재합니다.`));
        process.exit(1);
      }
      
      console.log(chalk.cyan(`\n📂 템플릿을 복사하는 중...`));
      await fs.copy(templatePath, targetPath);

      /**
       * [이슈 #1 해결] 도트 파일(Dotfiles) 이름 변경 로직
       * NPM 배포 시 무시되는 .gitignore와 .env를 처리합니다.
       */
      const renameMap = {
        'gitignore': '.gitignore', // 기존 사용 방식 대응
        '_gitignore': '.gitignore', // 신규 권장 방식 대응
        '_env': '.env'              // .env 대응
      };

      for (const [oldName, newName] of Object.entries(renameMap)) {
        const oldFilePath = path.join(targetPath, oldName);
        const newFilePath = path.join(targetPath, newName);

        if (await fs.pathExists(oldFilePath)) {
          await fs.move(oldFilePath, newFilePath, { overwrite: true });
          
          // .env가 생성될 때 .env.example도 함께 생성 (DX 개선)
          if (newName === '.env') {
            const exampleEnvPath = path.join(targetPath, '.env.example');
            await fs.copy(newFilePath, exampleEnvPath);
          }
        }
      }
      
      // 3. package.json 프로젝트 이름 수정
      const pkgPath = path.join(targetPath, 'package.json');
      if (await fs.pathExists(pkgPath)) {
        const pkg = await fs.readJson(pkgPath);
        pkg.name = projectName;
        await fs.writeJson(pkgPath, pkg, { spaces: 2 });
      }
      
      console.log(chalk.green(`✅ 템플릿 구성 및 환경 설정 완료!`));

      // 4. 패키지 자동 설치
      console.log(chalk.yellow(`\n📦 패키지 자동 설치를 진행합니다... (npm install)`));
      
      execSync('npm install', { 
        cwd: targetPath, 
        stdio: 'inherit' 
      });

      console.log(chalk.green(`\n✨ 모든 설치가 완료되었습니다!`));
      console.log(chalk.white(`\n다음 명령어로 시작하세요:\n`));
      console.log(chalk.cyan(`   cd ${projectName}`));
      console.log(chalk.cyan(`   npm run dev\n`));

    } catch (error) {
      console.error(chalk.red('\n❌ 프로젝트 생성 중 오류 발생:'), error);
    }
  });

program.parse(process.argv);