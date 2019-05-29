# based on https://github.com/nodejs/docker-node/blob/master/4.7/slim/Dockerfile

FROM node:10

# Match the jenkins uid/gid on the host (504)
RUN groupadd --gid 504 jenkins \
  && useradd --uid 504 --gid jenkins --shell /bin/bash --create-home jenkins

ENV YARN_VERSION 1.12.3
ENV NODE_ENV production

RUN apt-get update && apt-get install -y --no-install-recommends gconf-service libasound2 libatk1.0-0 libc6 libcairo2 \
                                                                 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 \
                                                                 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 \
                                                                 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 \
                                                                 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 \
                                                                 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 \
                                                libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates \
                                                fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils \
                                                x11vnc x11-xkb-utils xfonts-100dpi xfonts-75dpi xfonts-scalable \
                                                xfonts-cyrillic x11-apps xvfb xauth wget netcat \
  && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
  && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
  && apt-get update \
  && apt-get install -y google-chrome-unstable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst ttf-freefont \
    --no-install-recommends \
  && npm install -g yarn@$YARN_VERSION \
  && npm install -g s3-cli \
  && npm install -g codeclimate-test-reporter \
  && chmod +x /usr/local/lib/node_modules/yarn/bin/yarn.js

RUN mkdir -p /application

WORKDIR /application

USER jenkins
