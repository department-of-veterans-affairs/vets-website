# based on https://github.com/nodejs/docker-node/blob/master/4.7/slim/Dockerfile

FROM node:6

# Match the jenkins uid/gid on the host (504)
RUN groupadd --gid 504 jenkins \
  && useradd --uid 504 --gid jenkins --shell /bin/bash --create-home jenkins

ENV YARN_VERSION 0.27.5
ENV NODE_ENV production

RUN apt-get update && apt-get install -y netcat \
  && npm install -g yarn@$YARN_VERSION \
  && npm install -g nsp \
  && npm install -g s3-cli \
  && npm install -g codeclimate-test-reporter

RUN mkdir -p /application

WORKDIR /application

USER jenkins
