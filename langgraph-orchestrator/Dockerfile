FROM node:20-slim

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --production=false

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]