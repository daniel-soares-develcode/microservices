
# Microsserviços com Nest.js

Estrutura base para microsserviços com Nest.js, Prisma e Kafka.

## Variáveis de Ambiente

Para rodar esse projeto, você vai precisar adicionar as seguintes variáveis de ambiente no seu `.env` (todas presentes no `.env.example`, com exceção da variável `SLACK_WEBHOOK_URL`).

`PORT`

`JWT_SECRET`

`DATABASE_URL`

`KAFKA_BROKER`

`KAFKA_CLIENT_ID`

`KAFKA_GROUP_ID`

`SLACK_WEBHOOK_URL` (presente apenas no microsseriço `notifications`)

Em cada um dos repositórios clonados, rodar:

```bash
mv .env.example .env
```

## Rodando localmente

Em cada um dos repositórios clonados, rodar:

```bash
yarn && yarn build && yarn start
```

### Portas

 - users: 3010
 - purchases: 3020
 - notifications: 3030

Obs:

- Existe, no final desse documento, um docker-compose pronto
- os serviços levam alguns segundos para iniciar por completo
- o microsserviço `users`, na primeira vez que rodar, criará um usuário padrão com o id `xxxxxx`
- todas as requisições precisam conter um JWT válido, utilize o seguinte token (que referencia no payload o usuário criado anteriormente e tem data de expiração de vários anos) `xxxx`
## Dependências

### Linters

**devDependencies**: `@commitlint/cli` `@commitlint/config-conventional` `@typescript-eslint/eslint-plugin` `@typescript-eslint/parser` `eslint` `eslint-config-prettier` `eslint-plugin-prettier` `eslint-plugin-simple-import-sort` `husky` `lint-staged` `prettier` `pretty-quick`

### Nest.js core

**dependencies**: `@nestjs/common` `@nestjs/core` `@nestjs/platform-express` `reflect-metadata` `rimraf` `rxjs`

**devDependencies**: `@nestjs/cli` `@nestjs/schematics` `@types/express` `@types/node` `source-map-support` `ts-loader` `ts-node` `tsconfig-paths` `typescript` `webpack`

### Prisma (ORM)

**dependencies**: `@prisma/client` `nestjs-prisma`

**devDependencies**: `prisma`

### Autenticação e segurança

**dependencies**: `@nestjs/config` `@nestjs/jwt` `@nestjs/passport` `@nestjs/throttler` `helmet` `passport` `passport-jwt`

**devDependencies**: `@types/passport-jwt`

### Validação de payload

**dependencies**: `@nestjs/mapped-types` `class-transformer` `class-validator`

### Kafka

**dependencies**: `@nestjs/microservices` `kafkajs`

### Bot do Slack

**dependencies**: `nestjs-slack`

## Docker compose

```yml
version: '3.8'
services:
  database:
    image: 'bitnami/postgresql'
    ports:
      - '5442:5432'
    environment:
      - POSTGRESQL_USERNAME=postgres
      - POSTGRESQL_PASSWORD=postgres
      - POSTGRESQL_DATABASE=postgres

  zookeeper:
    image: confluentinc/cp-zookeeper:latest
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181
      ZOOKEEPER_TICK_TIME: 2000
    ports:
      - 22181:2181

  kafka:
    image: confluentinc/cp-kafka:latest
    depends_on:
      - zookeeper
    ports:
      - 29092:29092
    environment:
      KAFKA_BROKER_ID: 1
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://kafka:9092,PLAINTEXT_HOST://localhost:29092
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: PLAINTEXT:PLAINTEXT,PLAINTEXT_HOST:PLAINTEXT
      KAFKA_INTER_BROKER_LISTENER_NAME: PLAINTEXT
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1

  kafka_ui:
    image: provectuslabs/kafka-ui:latest
    depends_on:
      - kafka
    ports:
      - 8080:8080
    environment:
      KAFKA_CLUSTERS_0_ZOOKEEPER: zookeeper:2181
      KAFKA_CLUSTERS_0_NAME: local
      KAFKA_CLUSTERS_0_BOOTSTRAPSERVERS: kafka:9092

```


## Referência

 - [Nest.js](https://docs.nestjs.com/)
 - [Prisma](https://www.prisma.io/docs/)
 
