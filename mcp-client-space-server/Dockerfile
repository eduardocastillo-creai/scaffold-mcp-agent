FROM node:22-slim

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --production=false

COPY . .

RUN npm run build

EXPOSE 3001

CMD ["npm", "start"]