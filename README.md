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

- **⚡️ 100% ES Modules**: 구식 CommonJS(`require`)를 버리고 최신 `import/export` 문법을 기본으로 채택했습니다.
- **🏗 Layered Architecture**: 실무 표준인 `Controller` - `Service` - `Model` 구조를 자동으로 잡아줍니다.
- **📦 Auto Installation**: 프로젝트 생성 후 귀찮은 `npm install` 과정을 자동으로 수행합니다.
- **🛠 Ready-to-Use**: `dotenv`, `cors`, `morgan`, `nodemon` 등 필수 개발 환경이 세팅되어 있습니다.

## 🚀 Quick Start (사용법)

별도의 설치 없이 `npx` 명령어로 즉시 실행할 수 있습니다.

```bash
npx create-express-esm
npm create express-esm
```

또는 전역으로 설치하여 사용할 수도 있습니다

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
│   ├── config/          # ⚙️ 환경변수 및 DB 연결 설정
│   ├── controllers/     # 🕹️ 요청과 응답 처리 (Controller Layer)
│   ├── models/          # 🗄️ 데이터베이스 스키마 (Data Access Layer)
│   ├── routes/          # 🚦 API 라우팅 정의 (Route Definitions)
│   ├── services/        # 🧠 비즈니스 로직 (Service Layer) - 핵심 로직!
│   ├── app.js           # 🏗️ Express App 설정 (Middleware, CORS 등)
│   └── server.js        # 🚀 서버 실행 진입점 (Entry Point)
├── .env                 # 🔐 환경 변수 (Port, DB Key 등)
├── .gitignore           # 🙈 Git 무시 설정
└── package.json         # 📦 프로젝트 의존성 및 스크립트
```

## 🛠 Tech Stack (기술 스택)

- **Runtime**: Node.js
- **Framework**: Express.js
- **Architecture**: Layered Pattern (Controller-Service-Model)
- **Language**: JavaScript (ES6+ Modules)
- **Tools**:
  - `dotenv` (환경변수 관리)
  - `cors` (Cross-Origin 리소스 공유 설정)
  - `morgan` (HTTP 요청 로그 기록)
  - `nodemon` (개발 생산성 향상/자동 재시작)

## 🛠️ Engineering Deep Dive

단순한 도구 개발을 넘어, Node.js의 런타임 환경과 모듈 시스템의 차이를 깊이 있게 이해하기 위해 진행한 프로젝트입니다.

### - Project Motivation (Why)

대부분의 Express 예제나 스캐폴딩 도구들이 여전히 CommonJS(require) 방식을 사용하고 있습니다. 하지만 최신 Node.js 생태계는 ES Modules(import)로 전환되고 있습니다.
**"최신 문법을 지원하는 환경을 매번 수동으로 설정하는 비효율을 해결하자"**는 목표로 시작했으며, 프레임워크 없이 순수 Node.js의 `fs`, `path` 모듈을 다루며 CLI 도구의 동작 원리를 체득하고자 했습니다.

### - Architecture

1.  **비동기 파일 시스템 제어**: 대량의 템플릿 파일을 생성할 때 I/O 블로킹을 막기 위해 `fs.promises`와 `async/await`를 사용하여 안정적인 파일 쓰기 작업을 구현했습니다.
2.  **동적 템플릿 생성**: 사용자가 입력한 프로젝트 이름을 `package.json` 등에 동적으로 주입하여, 생성 즉시 실행 가능한 상태를 보장합니다.

## 🔥 Challenges & Troubleshooting

개발 과정에서 마주친 기술적 난관과 해결 과정입니다.

### 1. ESM 환경에서의 경로 시스템 구축 (Transition to ESM)

> **🔴 Problem:** `ReferenceError: __dirname is not defined`

프로젝트를 `type: "module"`(ESM)로 설정한 후, 템플릿 폴더 경로를 참조하기 위해 관습적으로 `__dirname`을 사용했으나 에러가 발생하며 앱이 종료되었습니다.

**🔍 Root Cause & Solution**

Node.js의 CommonJS 환경에서는 `__dirname`이 기본적으로 주입되지만, ESM 표준 스펙에는 이 변수가 존재하지 않습니다. 이를 해결하기 위해 `url`과 `path` 모듈을 조합하여 Polyfill(직접 구현) 했습니다.

```javascript
import path from "path";
import { fileURLToPath } from "url";

// 1. 현재 파일의 URL(file://...)을 시스템 경로로 변환
const __filename = fileURLToPath(import.meta.url);

// 2. 파일 경로에서 디렉토리 경로만 추출하여 __dirname 구현
const __dirname = path.dirname(__filename);
```

### 2. CLI의 실행 위치와 파일 위치의 혼동 (Execution Context)

> **🔴 Problem:** `ENOENT: no such file or directory`

로컬 테스트(`node bin/cli.js`) 시에는 정상 작동했으나, `npm link` 후 다른 경로(바탕화면 등)에서 실행했을 때 템플릿 폴더를 찾지 못하는 문제가 발생했습니다.

**🔍 Root Cause**

CLI 도구 개발 시 **'코드의 위치(Source)'**와 **'명령어 실행 위치(Target)'**가 다를 수 있음을 간과했습니다. 템플릿을 찾을 때 `process.cwd()`(사용자 위치)를 기준으로 탐색했기 때문에 발생한 문제였습니다.

**✅ Solution**

리소스의 성격에 따라 기준 경로를 명확히 분리하여 해결했습니다.

- **Source (Template)**: 코드가 설치된 곳에 항상 함께 존재하므로 `__dirname` 기준.
- **Target (Project)**: 사용자가 명령어를 실행한 위치에 생성되어야 하므로 `process.cwd()` 기준.

```javascript
// [Source] 템플릿 경로: 내 코드가 설치된 곳 기준
const templateDir = path.join(__dirname, "../template");

// [Target] 생성 경로: 사용자가 명령어를 실행한 곳 기준
const targetDir = path.join(process.cwd(), projectName);

// Copy: Source -> Target
await copyDir(templateDir, targetDir);
```

### 3. 배포 파이프라인 최적화 (Appropriate Technology)

> **🔴 Problem**

잦은 업데이트 과정에서 `버전 수정` -> `태그 생성` -> `깃 푸시` -> `npm 배포`라는 4단계 프로세스를 수동으로 반복하다 보니, 순서를 누락하거나 버전을 잘못 기입하는 휴먼 에러가 발생했습니다.

**🔍 Approach & Solution**

GitHub Actions와 같은 CI/CD 도구 도입을 고려했으나, 1인 개발 프로젝트 규모에 비해 설정 비용이 크고 오버엔지니어링이라는 판단이 들었습니다. 대신 Node.js의 내장 기능인 **NPM Scripts**를 활용하는 것이 가장 효율적인 **'적정 기술(Appropriate Technology)'**이라 판단했습니다.

```json
// package.json
"scripts": {
  // patch 버전 업 -> 깃 태그 푸시 -> npm 배포를 명령어 한 줄로 원자적(Atomic) 실행
  "deploy": "npm version patch && git push origin main --tags && npm publish"
}
```

## 📝 Retrospective

- **Legacy to Modern**: Node.js 생태계가 CJS에서 ESM으로 전환되는 과도기에서 발생하는 호환성 문제를 직접 겪고 해결하며, 모던 자바스크립트 환경에 대한 이해도를 높였습니다.
- **Consumer to Producer**: 항상 라이브러리를 사용하기만 하던 입장에서, 직접 도구를 만들어 배포하는 생산자가 되어봄으로써 오픈소스 생태계의 순환 구조를 체감했습니다.
- **JavaScript to TypeScript (Next Step)**: 순수 ESM 환경을 구축하며 모듈 시스템은 표준화했으나, 컴파일 단계에서 오류를 잡을 수 없는 동적 타입 언어의 한계를 체감했습니다. 프로젝트의 안정성과 유지보수성을 높이기 위해 **TypeScript** 도입과 엄격한 타입 시스템의 필요성을 깨달았으며, 차기 버전에서는 이를 지원할 계획입니다.

## 🗺️ Roadmap (Future Plans)

- [ ] **TypeScript Support**: `tsconfig.json` 자동 설정 및 `.ts` 템플릿 지원
- [ ] **Test Environment**: Jest/Supertest 설정 자동화

## 📝 License

This project is MIT licensed.
