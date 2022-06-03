FROM node:18-alpine3.14 As development

WORKDIR /usr/src/tier-app

COPY package*.json ./

RUN npm install --only=development

COPY . .

RUN npm run build

FROM node:18-alpine3.14 as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/tier-app

COPY package*.json ./

RUN npm install --only=production

COPY . .

COPY --from=development /usr/src/tier-app/dist ./dist

CMD ["node", "dist/src/http-server"]
