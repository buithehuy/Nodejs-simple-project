FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

COPY package.json package-lock.json ./
RUN npm install

COPY . .

EXPOSE 8081

CMD ["node", "src/server.js"]
