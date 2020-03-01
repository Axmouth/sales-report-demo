FROM node:13 AS build
 
# Define working directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
 
# Copy files and install dependencies
RUN npm install pm2 -g
COPY /server /usr/src/app/server
WORKDIR /usr/src/app/server
RUN npm install --production
WORKDIR /usr/src/app
 
# Set the running environment as production
ENV NODE_ENV production
 
# Expose on specified network port
EXPOSE 3100 4000
 
# Executing defaults
CMD ["pm2-docker", "start", "server/process.json"]