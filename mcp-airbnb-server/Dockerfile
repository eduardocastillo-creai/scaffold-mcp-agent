FROM node:lts-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --ignore-scripts

COPY . .

RUN npm run build

EXPOSE 3005

CMD [ "node", "dist/index.js" ]
