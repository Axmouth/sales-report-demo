FROM node:13 AS build
 
# Define working directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
 
# Copy files and install dependencies
RUN npm install @angular/cli@~9.0.0 -g
COPY /client /usr/src/app/client
WORKDIR /usr/src/app/client
RUN npm i
RUN ng build --prod
WORKDIR /usr/src/app

FROM nginx:1.17.1-alpine
COPY --from=build /usr/src/app/client/dist/client /usr/share/nginx/html
COPY --from=build /client/nginx.conf /etc/nginx/conf.d/default