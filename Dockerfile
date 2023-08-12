FROM node:lts-alpine

RUN npm install -g http-server

WORKDIR /app

COPY . .

RUN npm instal  l

RUN npm run build

EXPOSE 8080

CMD [ "http-server", "dist" ]
