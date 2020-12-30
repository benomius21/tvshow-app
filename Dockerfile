FROM node:latest as node
WORKDIR /app
RUN npm install
COPY . .
RUN npm run build --prod

FROM nginx:alpine
COPY --from=node /app/dist/tvshow-app /usr/share/nginx/html
COPY ./nginx-custom.conf /etc/nginx/conf.d/default.conf
