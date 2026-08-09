# Kafka Lab
Kafka, K8s 학습 목적의 K8s 시각화 프로젝트입니다. [링크](https://kafka.taeyoung-no.com)

## 목차
1. [기능](#기능)
2. [기술 스택](#기술-스택)
3. [개발 노트](#개발-노트)
4. [로컬 실행](#로컬-실행)

## 기능
- producer가 이벤트 생성, 생성된 이벤트가 partition으로 이동, consumer가 이벤트를 소비하는 흐름 시각화
- partition 3개 시각화
- replica 3개 시각화, leader와 follower 표시
- topic을 처음 생성한 것처럼 초기화하는 버튼

## 기술 스택
### 프론트엔드
React, TypeScript인데 100% 바이브 코딩, 검토 안 했습니다.

### 백엔드
Spring Boot, Java

### 메시지 브로커
Kafka

### 인프라
Docker(개발용), K8s(프로덕션용)

### 배포
AWS ECR, EKS

## 개발 노트
- [EKS에 배포하면서 겪은 시행착오 모음](https://taeyoung-no.github.io/kafka%20lab/2026/08/09/eks.html)

## 로컬 실행
### 요구사항
- Java 21
- Node.js 20+
- Docker, Docker Compose
- npm

### 의존성
```bash
npm install --prefix client
```

### 백엔드 빌드
```bash
./server/producer/gradlew -p server/producer bootJar
./server/consumer/gradlew -p server/consumer bootJar
./server/monitor/gradlew -p server/monitor bootJar
```

### 개발 서버
```bash
docker compose -f server/docker-compose.yml up -d --build
npm run dev --prefix client
```
