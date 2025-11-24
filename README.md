# 🚀 Create Express ESM (CLI)

> **Modern Express Generator**
>
> "더 이상 구식 문법(`require`)과 복잡한 설정에 시간을 낭비하지 마세요."
> 명령어 한 줄로 **ES Modules**와 **Layered Architecture**가 적용된 프로젝트를 1초 만에 생성합니다.

[![npm version](https://img.shields.io/npm/v/create-express-esm.svg)](https://www.npmjs.com/package/create-express-esm)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ Key Features (핵심 기능)

기존 `express-generator`의 한계를 분석하고 개선하여 개발했습니다.

- **⚡️ 100% ES Modules**: 구식 CommonJS(`require`)를 버리고 최신 `import/export` 문법을 기본으로 채택했습니다.
- **🏗 Layered Architecture**: 실무 표준인 `Controller` - `Service` - `Model` 구조를 자동으로 잡아줍니다.
- **📦 Auto Installation**: 프로젝트 생성 후 귀찮은 `npm install` 과정을 자동으로 수행합니다.
- **🛠 Ready-to-Use**: `dotenv`, `cors`, `morgan`, `nodemon` 등 필수 개발 환경이 세팅되어 있습니다.

## 🚀 Quick Start (사용법)

별도의 설치 없이 `npx` 명령어로 즉시 실행할 수 있습니다.

```bash
npx create-express-esm
```

또는 전역으로 설치하여 사용할 수도 있습니다.

```
npm install -g create-express-esm
create-express-esm
```

## 📂 Project Structure (폴더 구조)

이 도구는 **Layered Architecture (계층형 아키텍처)**를 기반으로 프로젝트를 생성합니다.
**관심사 분리(Separation of Concerns)** 원칙을 적용하여, 로직이 섞이지 않고 유지보수가 쉬운 구조를 제공합니다.

```text
my-app/
├── src/
│   ├── config/          # ⚙️ 환경변수 및 DB 연결 설정
│   ├── controllers/     # 🕹️ 요청과 응답 처리 (Controller Layer)
│   ├── models/          # 🗄️ 데이터베이스 스키마 (Data Access Layer)
│   ├── routes/          # 🚦 API 라우팅 정의 (Route Definitions)
│   ├── services/        # 🧠 비즈니스 로직 (Service Layer) - 핵심 로직!
│   ├── app.js           # 🏗️ Express App 설정 (Middleware, CORS 등)
│   └── server.js        # 🚀 서버 실행 진입점 (Entry Point)
├── .env                 # 🔐 환경 변수 (Port, DB Key 등)
├── .gitignore           # 🙈 Git 무시 설정
└── package.json         # 📦 프로젝트 의존성 및 스크립트
```

## 🛠 Tech Stack (기술 스택)

Runtime: Node.js

Framework: Express.js

Architecture: Layered Pattern (Controller-Service-Model)

Language: JavaScript (ES6+ Modules)

Tools:

dotenv (환경변수 관리)

cors (CORS 설정)

morgan (HTTP 로그)

nodemon (개발용 서버 자동 재시작)

## 🤝 Contributing

버그 신고, 기능 제안, PR은 언제나 환영합니다! 이슈는 Issues 탭을 이용해 주세요.

## 📝 License

This project is MIT licensed.
