# 🚀 Create Express ESM (CLI)

> **Modern Express Generator with Database & Error Handling**
>
> "1초 만에 완성하는 Modern Express(ESM) + Prisma + Docker 환경"
>
> CommonJS(require)가 아닌, 최신 ES Modules(import/export) 문법을 기반으로 하며, 데이터베이스 연동 및 전문적인 에러 핸들링까지 포함된 Express 프로젝트 구조를 자동으로 생성해주는 CLI 도구입니다.

[![npm version](https://img.shields.io/npm/v/create-express-esm.svg)](https://www.npmjs.com/package/create-express-esm)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ Demo

![Image](https://github.com/user-attachments/assets/10a7c289-ba5b-42a0-bfb8-6319610fef78)

## ✨ Key Features (핵심 기능)

기존 `express-generator`의 한계를 분석하고 개선하여 개발했습니다. v1.2.0 업데이트를 통해 실무형 풀스택 베이스를 제공합니다.

- **🌐 Multi-Language Support**: JavaScript(ESM)와 **TypeScript** 중 원하는 개발 환경을 선택할 수 있습니다.
- **🗄️ Database Integration**: **Prisma ORM**과 **PostgreSQL** 환경을 즉시 구축합니다. (Docker Compose 자동 생성)
- **🚨 Professional Error Handling**: `AppError` 클래스와 **Global Error Middleware**를 통한 중앙 집중식 에러 처리 시스템을 제공합니다.
- **🧪 Integrated Testing**: 최신 테스트 프레임워크인 **Vitest**와 API 테스트용 **Supertest** 환경을 자동 설정합니다.
- **🏗 Layered Architecture**: 실무 표준인 `Controller` - `Service` - `Route` - `Middleware` 계층 구조를 제공합니다.
- **⚡️ Modern Execution**: `ts-node`의 ESM 호환성 문제를 해결한 **`tsx`**를 채택하여 쾌적한 개발 환경을 제공합니다.
- **📦 Smart Auto-Installation**: 프로젝트 생성 즉시 의존성 설치 및 환경 변수(`.env`) 세팅을 완료합니다.

## 🚀 Quick Start (사용법)

별도의 설치 없이 `npx` 명령어로 즉시 실행할 수 있습니다.

```bash
npx create-express-esm
```

### 프로젝트 생성 후 DB 시작하기

DB 옵션을 선택했다면, 단 몇 줄의 명령어로 개발 준비가 끝납니다.

```bash
# 1. 프로젝트 폴더 이동
cd my-app

# 2. Docker를 통한 PostgreSQL 실행
npm run db:up

# 3. Prisma 스키마를 DB에 반영 (테이블 생성)
npm run db:push

# 4. 서버 실행
npm run dev
```

또는 전역으로 설치하여 사용할 수도 있습니다.

```bash
npm install -g create-express-esm
create-express-esm
```

## 📂 Project Structure (폴더 구조)

이 도구는 **Layered Architecture (계층형 아키텍처)**를 기반으로 프로젝트를 생성합니다.
관심사 분리(Separation of Concerns) 원칙을 적용하여 유지보수가 쉬운 구조를 제공합니다.

```text
my-app/
├── prisma/             # 🗄️ Prisma Schema & Migrations
├── src/
│   ├── controllers/    # 🕹️ 요청 처리 및 응답 반환 (Controller Layer)
│   ├── services/       # 🧠 비즈니스 로직 처리 (Service Layer)
│   ├── routes/         # 🚦 API 엔드포인트 정의 (Route Layer)
│   ├── middlewares/    # 🛡️ 전역 에러 핸들러 및 커스텀 미들웨어
│   ├── utils/          # 🛠️ AppError 클래스 등 공통 유틸리티
│   ├── lib/            # 🖇️ Prisma Client 인스턴스 (Singleton)
│   ├── app.ts          # 🏗️ Express 앱 설정 및 미들웨어
│   ├── server.ts       # 🚀 서버 진입점 (Entry Point)
│   └── app.test.ts     # 🧪 Vitest 샘플 테스트 코드
├── .env                # 🔐 환경 변수 (DATABASE_URL 자동 생성)
├── docker-compose.yml  # 🐳 PostgreSQL 컨테이너 설정
├── vitest.config.ts    # 🧪 Vitest 설정 파일
├── tsconfig.json       # ⚙️ TS 컴파일러 설정 (TS 선택 시)
└── package.json        # 📦 의존성 및 스크립트
```

## 🛠 Tech Stack (기술 스택)

- **Runtime**: Node.js (v20+)
- **Framework**: Express.js
- **Language**: JavaScript (ESM) / TypeScript 5.x
- **ORM**: Prisma (PostgreSQL)
- **Infrastructure**: Docker Compose
- **Testing**: Vitest, Supertest
- **Dev Tools**:
  - `tsx` (TypeScript Execution Engine)
  - `nodemon` (Hot Reload)
  - `@clack/prompts` (Interactive CLI UI)
  - `dotenv` (Environment Variables)
  - `cors` (Cross-Origin Resource Sharing)
  - `chalk` (CLI Styling)

## 📝 Retrospective

- **표준화된 환경의 중요성**: CJS에서 ESM으로 넘어가는 과도기적 문제를 해결하며 모던 자바스크립트 모듈 시스템에 대한 깊은 이해를 얻었습니다.
- **에러 핸들링의 중앙화**: 개별 컨트롤러에서 반복되던 에러 처리 로직을 전역 미들웨어로 위임하여 코드 가독성과 유지보수성을 극대화했습니다.
- **인프라 환경 이슈 해결**: 로컬 PostgreSQL과의 포트 충돌(5432 vs 5433) 및 도커 볼륨 인증 문제를 해결하며, 사용자에게 가장 안정적인 DB 연결 가이드를 제공하는 데 성공했습니다.
- **UX 기반 설계**: 사용자가 프로젝트를 생성하자마자 `npm run dev`와 `npm test`를 즉시 실행할 수 있는 "Zero-Config" 환경을 제공하는 데 집중했습니다.

## 🗺️ Roadmap (Future Plans)

- [x] **TypeScript Support**: `.ts` 템플릿 및 `tsx` 환경 최적화
- [x] **Test Environment**: Vitest 및 Supertest 설정 자동화
- [x] **Interactive UI Upgrade**: `Clack` 라이브러리를 통한 시각적 CLI UI 개선
- [x] **Database Integration**: Prisma/PostgreSQL 및 Docker 선택 옵션 추가
- [ ] **Authentication Template**: JWT/Passport를 이용한 기본 인증 로직 추가
- [ ] **Deployment Guide**: AWS/Render 등 주요 플랫폼 배포 가이드라인 추가

## 📝 License

This project is MIT licensed.
