FROM node:10.0.0 AS builder

RUN npm install -g npm@latest

# dev or prod
ARG ENV="prod"

COPY package.json package-lock.json /app/

WORKDIR /app

RUN npm install

COPY . /app/

RUN npm run build:${ENV}

#############

FROM nginx:1.13.12-alpine

COPY nginx/nginx.conf /etc/nginx/
COPY nginx/conf.d /etc/nginx/conf.d

COPY --from=builder /app/dist/web-app /var/www/html
