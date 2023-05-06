FROM node:20-alpine3.16
COPY package.json /app/package.json
WORKDIR /app
RUN npm i

COPY ./src /app/src
EXPOSE 42068

CMD ["node", "/app/src/laas.js"]
