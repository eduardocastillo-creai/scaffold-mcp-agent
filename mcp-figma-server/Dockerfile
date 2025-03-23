FROM node:20-slim

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --production=false

COPY . .

RUN npm run build

EXPOSE 3004

CMD ["npm", "start"]