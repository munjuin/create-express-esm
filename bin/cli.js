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
  .version('1.0.0')
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

    // 2. 템플릿 복사
    console.log(chalk.cyan(`\n📂 템플릿을 복사하는 중...`));
    try {
      if (fs.existsSync(targetPath)) {
        console.error(chalk.red(`❌ 오류: '${projectName}' 폴더가 이미 존재합니다.`));
        process.exit(1);
      }
      
      await fs.copy(templatePath, targetPath);

      // [추가된 부분] 파일 이름 변경 로직 (gitignore -> .gitignore)
      // npm이 .gitignore를 멋대로 삭제하는 것을 방지하기 위함
      const gitignorePath = path.join(targetPath, 'gitignore');
      const dotGitignorePath = path.join(targetPath, '.gitignore');
      
      const envPath = path.join(targetPath, '_env'); // 만약 _env로 바꿨다면
      const dotEnvPath = path.join(targetPath, '.env');

      // 파일이 실제로 존재하는지 확인 후 이름 변경
      if (await fs.pathExists(gitignorePath)) {
        await fs.move(gitignorePath, dotGitignorePath);
      }
      
      if (await fs.pathExists(envPath)) {
        await fs.move(envPath, dotEnvPath);
      }
      
      // package.json 이름 수정
      const pkgPath = path.join(targetPath, 'package.json');
      const pkg = await fs.readJson(pkgPath);
      pkg.name = projectName;
      await fs.writeJson(pkgPath, pkg, { spaces: 2 });
      
      console.log(chalk.green(`✅ 복사 완료!`));

      // 3. 자동 설치 (핵심 기능!)
      console.log(chalk.yellow(`\n📦 패키지 자동 설치를 진행합니다... (npm install)`));
      
      execSync('npm install', { 
        cwd: targetPath, 
        stdio: 'inherit' // 설치 로그를 터미널에 보여줌
      });

      console.log(chalk.green(`\n✨ 모든 설치가 완료되었습니다!`));
      console.log(chalk.white(`\n다음 명령어로 시작하세요:\n`));
      console.log(chalk.cyan(`  cd ${projectName}`));
      console.log(chalk.cyan(`  npm run dev`));

    } catch (error) {
      console.error(chalk.red('오류 발생:'), error);
    }
  });

program.parse(process.argv);