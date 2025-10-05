FROM node:20
WORKDIR /app

# nur package.json + lockfile kopieren, dann deps installieren
COPY package.json package-lock.json ./
RUN npm ci

# restlichen Code kopieren
COPY . .

EXPOSE 3000
CMD ["npm", "run", "start:dev"]
