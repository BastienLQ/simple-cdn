FROM node:latest

RUN apt-get install git && mkdir -p /opt/app && cd /opt/app && git clone https://github.com/BastienLQ/simple-cdn . && npm install
WORKDIR /opt/app

CMD cd /opt/app && PORT=80 PUBLIC_DIR="files/" npm start
VOLUME ["/opt/app/files"]

EXPOSE 80
