# syntax=docker/dockerfile:1.4

### --- DEVELOPMENT STAGE ---
FROM node:lts AS dev

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install

ENV CI=true
ENV PORT=3000

COPY . .

# запуск development сервера Vite
CMD ["npm", "run", "dev"]


### --- BUILD STAGE ---
FROM node:lts AS build

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build


### --- PRODUCTION STAGE ---
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
