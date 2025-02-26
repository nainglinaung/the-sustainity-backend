FROM node:20-alpine
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

RUN mkdir -p uploads logs

EXPOSE 5000

CMD ["npm", "start"]