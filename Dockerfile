# based on https://github.com/nodejs/docker-node/blob/master/4.7/slim/Dockerfile

FROM node:6-alpine

# Match the jenkins uid/gid on the host (504)
RUN echo http://dl-2.alpinelinux.org/alpine/edge/community/ >> /etc/apk/repositories \
  && apk update \
  && apk add bash \
  && apk --no-cache --virtual .shadow add shadow \
  && groupadd --gid 504 jenkins \
  && useradd --uid 504 --gid jenkins --shell /bin/bash --create-home jenkins \
  && apk del .shadow

ENV YARN_VERSION 0.27.5
ENV NODE_ENV production

RUN apk --no-cache add git make python g++ \
  && npm install -g yarn@$YARN_VERSION \
  && npm install -g nsp \
  && npm install -g s3-cli \
  && npm install -g codeclimate-test-reporter

RUN mkdir -p /application

WORKDIR /application
USER jenkins
