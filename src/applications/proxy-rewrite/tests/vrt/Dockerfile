# based on https://github.com/nodejs/docker-node/blob/master/4.7/slim/Dockerfile

FROM node:8

# Match the jenkins uid/gid on the host (504)
RUN groupadd --gid 504 jenkins \
  && useradd --uid 504 --gid jenkins --shell /bin/bash --create-home jenkins

ENV YARN_VERSION 1.12.3
ENV NODE_ENV production

RUN apt-get update && apt-get install -y netcat \
  && npm install -g yarn@$YARN_VERSION \
  && chmod +x /usr/local/lib/node_modules/yarn/bin/yarn.js

RUN mkdir -p /application \
  && mkdir -p /application/node_modules \
  && chmod +x /application \
  && chmod +x /application/node_modules

WORKDIR /application

ADD . .

RUN yarn install

ENTRYPOINT ["./vrt-entrypoint.sh"]

# USER jenkins