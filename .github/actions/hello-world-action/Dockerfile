# Container image that runs your code
FROM alpine:3.10

# Copies your code file from your action repository to the filesystem path `/` of the container
COPY index.js /index.js
COPY package.json /package.json

# Install dependencies
RUN apk add --update nodejs npm
RUN npm install

# Code file to execute when the docker container starts up (`index.js`)
ENTRYPOINT ["node", "/index.js"]
