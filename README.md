# 🚀 Create Express ESM (CLI)

> **Modern Express Generator with Multi-Database & Zero-Config**
>
> "1초 만에 완성하는 Modern Express(ESM) + Prisma + Multi-DB Docker 환경"
>
> 최신 ES Modules(import/export)를 기반으로, 사용자가 선택한 데이터베이스(PostgreSQL, MySQL, MariaDB, MongoDB) 환경을 즉시 구축해주는 지능형 CLI 도구입니다.

[![npm version](https://img.shields.io/npm/v/create-express-esm.svg)](https://www.npmjs.com/package/create-express-esm)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ Demo

![Image](https://github.com/user-attachments/assets/10a7c289-ba5b-42a0-bfb8-6319610fef78)

## ✨ Key Features (핵심 기능)

v1.2.4 업데이트를 통해 더욱 강력해진 실무형 풀스택 베이스를 제공합니다.

- **🗄️ Multi-Database Support**: **PostgreSQL, MySQL, MariaDB, MongoDB** 중 프로젝트에 필요한 DB를 선택할 수 있습니다.
- **🐳 Smart Docker Orchestration**: 각 DB 엔진에 최적화된 Docker Compose 설정을 자동 생성합니다. (포트 충돌 방지 설계 적용)
- **🏗 Layered Architecture**: 실무 표준인 `Controller` - `Service` - `Route` - `Middleware` 계층 구조를 제공합니다.
- **🚨 Professional Error Handling**: `AppError` 클래스와 **Global Error Middleware**를 통한 중앙 집중식 에러 관리 시스템을 내장하고 있습니다.
- **🧪 Integrated Testing**: 최신 테스트 프레임워크인 **Vitest**와 API 테스트용 **Supertest** 환경을 자동 설정합니다.
- **⚡ Modern Execution**: `ts-node`보다 빠르고 ESM 호환성이 뛰어난 **`tsx`**를 채택했습니다.
- **📦 Zero-Config Setup**: 프로젝트 생성 즉시 의존성 설치, `.env` 환경 변수 세팅 및 Prisma 스키마 최적화를 완료합니다.

## 🚀 Quick Start (사용법)

별도의 설치 없이 `npx` 명령어로 즉시 실행하여 인터렉티브하게 프로젝트를 생성하세요.

```bash
npx create-express-esm
```

### 프로젝트 생성 후 DB 시작하기

```
# 1. 프로젝트 폴더 이동
cd my-app

# 2. Docker를 통한 데이터베이스 실행
npm run db:up

# 3. Prisma 스키마 반영 (테이블/컬렉션 생성)
npm run db:push

# 4. 개발 서버 실행
npm run dev
```

## 🗄️ Database Options

v1.2.4에서는 각 환경별 최적화된 기본 포트를 제공하여 윈도우 시스템(Hyper-V)과의 포트 충돌을 최소화하고, 선택한 DB에 맞는 전용 환경을 구축합니다.

| Database       | Docker Image         | Default Port | Prisma Provider |
| :------------- | :------------------- | :----------- | :-------------- |
| **PostgreSQL** | `postgres:15-alpine` | `5433`       | `postgresql`    |
| **MySQL**      | `mysql:8.0`          | `4306`       | `mysql`         |
| **MariaDB**    | `mariadb:10.11`      | `5306`       | `mysql`         |
| **MongoDB**    | `mongo:6.0`          | `27017`      | `mongodb`       |

## 📂 Project Structure (폴더 구조)

이 도구는 **Layered Architecture (계층형 아키텍처)**를 기반으로 프로젝트를 생성하여 높은 유지보수성을 보장합니다.

```text
my-app/
├── prisma/             # 🗄️ Prisma Schema (선택한 DB 전용 템플릿)
├── src/
│   ├── controllers/    # 🕹️ 요청 처리 및 응답 반환 (Controller Layer)
│   ├── services/       # 🧠 비즈니스 로직 처리 (Service Layer)
│   ├── routes/         # 🚦 API 엔드포인트 정의 (Route Layer)
│   ├── middlewares/    # 🛡️ 전역 에러 핸들러 및 커스텀 미들웨어
│   ├── utils/          # 🛠️ AppError 클래스 등 공통 유틸리티
│   ├── lib/            # 🖇️ Prisma Client 인스턴스 (Singleton)
│   ├── app.ts          # 🏗️ Express 앱 설정 및 미들웨어
│   └── server.ts       # 🚀 서버 진입점 (Entry Point)
├── .env                # 🔐 환경 변수 (DATABASE_URL 자동 생성)
├── docker-compose.yml  # 🐳 DB 컨테이너 설정 (Port conflict 방지 설계)
├── vitest.config.ts    # 🧪 Vitest 설정 파일
└── package.json        # 📦 의존성 및 스크립트
```

## 🗺️ Roadmap (Future Plans)

- [x] TypeScript & tsx: 최신 TS 환경 완벽 지원

- [x] Testing Setup: Vitest/Supertest 자동화

- [x] Multi-DB Support: 4종 DB(Postgres, MySQL, MariaDB, Mongo) 지원

- [ ] Authentication Template: JWT/Passport 기반 인증 로직 추가

- [ ] Validation Layer: Zod를 이용한 요청 값 검증 미들웨어 추가

- [ ] API Documentation: Swagger(OpenAPI) 자동 생성 지원

## 📝 License

This project is MIT licensed.
