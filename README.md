## Description

URL Shortener.

## Installation

```bash
$ cp .env.example .env
$ docker-compose up -d --build
```

## Running DB migrations

```bash
$ docker exec -w /usr/src/tier-app tier-app npm run migration:run:dev
```

## Seed hashes

```bash
$ docker exec -w /usr/src/tier-app tier-app npm run worker:seed-not-used-hash:dev
```

## Cache hashes

```bash
$ docker exec -w /usr/src/tier-app tier-app npm run worker:refresh-cached-hash:dev
```

## Use the app

### Shorten your url:

```bash
$ curl --request POST '127.0.0.1:3000' \
--header 'Content-Type: application/json' \
--data-raw '{
    "url": "http:/test.com"
}'
```

### Use shortened url:

```bash
$ curl --request GET '127.0.0.1:3000/rqE'
```

## Test

```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov
```
