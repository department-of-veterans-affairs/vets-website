FROM node

RUN npm install -g nsp && \
    npm install -g s3-cli && \
      apt-get update && \
      apt-get install -y netcat default-jre

WORKDIR /application

COPY package.json .

RUN npm install
RUN npm run selenium:bootstrap

COPY . .
