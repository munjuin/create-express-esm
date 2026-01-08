# 🚀 Create Express ESM (CLI)

> **Modern Express Generator**
>
> "1초 만에 완성하는 Modern Express(ESM) 환경"
>
> CommonJS(require)가 아닌, 최신 ES Modules(import/export) 문법을 기반으로 하는 Express 프로젝트 구조를 자동으로 생성해주는 CLI 도구입니다.

[![npm version](https://img.shields.io/npm/v/create-express-esm.svg)](https://www.npmjs.com/package/create-express-esm)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ Demo

![Image](https://github.com/user-attachments/assets/10a7c289-ba5b-42a0-bfb8-6319610fef78)

## ✨ Key Features (핵심 기능)

기존 `express-generator`의 한계를 분석하고 개선하여 개발했습니다.

- **🌐 Multi-Language Support**: JavaScript(ESM)와 **TypeScript** 중 원하는 개발 환경을 선택할 수 있습니다.
- **🧪 Integrated Testing**: 최신 테스트 프레임워크인 **Vitest**와 API 테스트용 **Supertest** 환경을 자동 설정합니다.
- **🏗 Layered Architecture**: 실무 표준인 `Controller` - `Service` - `Route` 계층 구조를 제공합니다.
- **⚡️ Modern TS Execution**: `ts-node`의 ESM 호환성 문제를 해결한 **`tsx`**를 채택하여 쾌적한 개발 환경을 제공합니다.
- **📦 Smart Auto-Installation**: 프로젝트 생성 즉시 의존성 설치 및 환경 변수(`.env`) 세팅을 완료합니다.

## 🚀 Quick Start (사용법)

별도의 설치 없이 `npx` 명령어로 즉시 실행할 수 있습니다.

```bash
npx create-express-esm
create-express-esm
```

또는 전역으로 설치하여 사용할 수도 있습니다

```
npm install -g create-express-esm
```

## 📂 Project Structure (폴더 구조)

이 도구는 **Layered Architecture (계층형 아키텍처)**를 기반으로 프로젝트를 생성합니다.
**관심사 분리(Separation of Concerns)** 원칙을 적용하여, 로직이 섞이지 않고 유지보수가 쉬운 구조를 제공합니다.

```text
my-app/
├── src/
│   ├── controllers/    # 🕹️ 요청 처리 및 응답 반환 (Controller Layer)
│   ├── services/       # 🧠 비즈니스 로직 처리 (Service Layer)
│   ├── routes/         # 🚦 API 엔드포인트 정의 (Route Layer)
│   ├── app.ts (or .js) # 🏗️ Express 앱 설정 및 미들웨어
│   ├── server.ts (.js) # 🚀 서버 진입점 (Entry Point)
│   └── app.test.ts     # 🧪 Vitest 샘플 테스트 코드
├── .env                # 🔐 환경 변수 (자동 생성)
├── vitest.config.ts    # 🧪 Vitest 설정 파일
├── tsconfig.json       # ⚙️ TS 컴파일러 설정 (TS 선택 시)
└── package.json        # 📦 의존성 및 스크립트
```

주인님, 요청하신 대로 🛠 Tech Stack (기술 스택) 섹션부터 마지막까지의 내용을 마크다운 코드로 정리해 드립니다. 이 부분은 주인님이 이번에 해결하신 기술적 도전 과제들이 고스란히 담겨 있어 포트폴리오로서의 가치가 매우 높습니다.

Markdown

## 🛠 Tech Stack (기술 스택)

- **Runtime**: Node.js (v20+)
- **Framework**: Express.js
- **Language**: JavaScript (ESM) / TypeScript 5.x
- **Testing**: Vitest, Supertest
- **Dev Tools**:
  - `tsx` (TypeScript Execution Engine)
  - `nodemon` (Hot Reload)
  - `dotenv` (Environment Variables)
  - `cors` (Cross-Origin Resource Sharing)
  - `chalk` (CLI Styling)

## 📝 Retrospective

- **표준화된 환경의 중요성**: CJS에서 ESM으로 넘어가는 과도기적 문제를 해결하며 모던 자바스크립트 모듈 시스템에 대한 깊은 이해를 얻었습니다.
- **UX 기반 설계**: 사용자가 프로젝트를 생성하자마자 `npm run dev`와 `npm test`를 즉시 실행할 수 있는 "Zero-Config" 환경을 제공하는 데 집중했습니다.
- **배포 프로세스의 성숙**: 수동 배포의 위험성을 CI/CD와 OIDC 도입을 통해 자동화하며 소프트웨어 릴리스 과정의 안정성을 확보했습니다.

## 🗺️ Roadmap (Future Plans)

- [x] **TypeScript Support**: `.ts` 템플릿 및 `tsx` 환경 최적화
- [x] **Test Environment**: Vitest 및 Supertest 설정 자동화
- [ ] **Interactive UI Upgrade**: `Clack` 라이브러리를 통한 시각적 CLI UI 개선
- [ ] **Database Integration**: Prisma/Sequelize 등 ORM 선택 옵션 추가

## 📝 License

This project is MIT licensed.
