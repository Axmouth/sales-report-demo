docker build -f docker/client/Dockerfile -t axmouth/sales-report-demo-client .
docker build -f docker/server/Dockerfile -t axmouth/sales-report-demo-server .
docker-compose up -d