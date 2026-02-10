# based on https://github.com/nodejs/docker-node/blob/master/4.7/slim/Dockerfile

FROM node:22.22.0-bookworm

# default case is Jenkins, but we want to be able to overwrite this
ARG userid=504
RUN groupadd -g $userid vets-website \
  && useradd -u $userid -r -m -d /application -g vets-website vets-website

ENV YARN_VERSION 1.19.1
ENV NODE_ENV production

RUN apt-get update

# Install latest stable Chrome from Google's official repository
RUN wget -qO- https://dl.google.com/linux/linux_signing_key.pub | \
    gpg --dearmor -o /usr/share/keyrings/google-chrome.gpg && \
    echo "deb [arch=amd64 signed-by=/usr/share/keyrings/google-chrome.gpg] http://dl.google.com/linux/chrome/deb/ stable main" \
    > /etc/apt/sources.list.d/google-chrome.list && \
    apt-get update && \
    apt-get install -y --no-install-recommends google-chrome-stable

RUN apt-get install -y --no-install-recommends libasound2 libatk1.0-0 libc6 libcairo2 \
    libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc-s1 \
    libgdk-pixbuf2.0-0 libglib2.0-0 \
    libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 \
    libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 \
    libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 \
    libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates \
    fonts-liberation libnss3 lsb-release xdg-utils \
    x11vnc x11-xkb-utils xfonts-100dpi xfonts-75dpi xfonts-scalable \
    x11-apps xvfb xauth netcat-openbsd dumb-init libgbm-dev

RUN curl -k "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
RUN unzip awscliv2.zip
RUN ./aws/install
RUN aws --version # Verify AWS CLI installation.

# Explicitly set CA cert to resolve SSL issues with AWS.
ENV AWS_CA_BUNDLE /etc/ssl/certs/ca-certificates.crt

# Add VA Root CA to Docker Certificate Authority (CA) Store so that NODE can use it for requests.
ADD https://raw.githubusercontent.com/department-of-veterans-affairs/platform-va-ca-certificate/main/VA-Internal-S2-RCA1-v1.cer /usr/local/share/ca-certificates/
RUN openssl x509 -inform DER -in /usr/local/share/ca-certificates/VA-Internal-S2-RCA1-v1.cer -out /usr/local/share/ca-certificates/VA-Internal-S2-RCA1-v1.crt
RUN update-ca-certificates

RUN mkdir -p /application
WORKDIR /application

USER vets-website
ENV NODE_EXTRA_CA_CERTS /etc/ssl/certs/ca-certificates.crt

RUN npm config set strict-ssl false

ENTRYPOINT ["/usr/bin/dumb-init", "--"]
