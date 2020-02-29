FROM node:13
 
MAINTAINER George Nicolson &lt;admin@giorgosnikolop.info&gt;
 
# Define working directory
RUN mkdir -p /usr/src/sales-report-demo
WORKDIR /usr/src/sales-report-demo
 
# Copy files and install dependencies
COPY /server/package.json /usr/src/sales-report-demo
RUN npm install --production
RUN npm install pm2 -g
COPY /server /usr/src/sales-report-demo/server
COPY /client/dist /usr/src/sales-report-demo/client
#COPY dist /usr/src/sales-report-demo
 
# Set the running environment as production
ENV NODE_ENV production
 
# Expose on specified network port
EXPOSE 3100 4000
 
# Executing defaults
CMD ["pm2-docker", "start", "server/process.json"]