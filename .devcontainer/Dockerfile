# See here for image contents: https://github.com/devcontainers/images/tree/main/src/javascript-node

# Base image includes nvm for managing multiple Node versions
ARG VARIANT="22-bookworm"
FROM mcr.microsoft.com/devcontainers/javascript-node:${VARIANT}

# default case is Jenkins, but we want to be able to overwrite this
ARG userid=504
RUN groupadd -g $userid vets-website \
  && useradd -u $userid -r -m -d /application -g vets-website vets-website

ENV YARN_VERSION 1.19.1

# Install Node 22.22.0 and set as default
# Use nvm which is pre-installed in the devcontainer base image
# Also fix permissions so the node user can install additional versions if needed
RUN bash -c "source /usr/local/share/nvm/nvm.sh && nvm install 22.22.0 && nvm alias default 22.22.0 && nvm use default" \
    && chmod -R 777 /usr/local/share/nvm/.cache

RUN apt-get update

# Install dependencies for Chrome/Cypress
RUN apt-get install -y --no-install-recommends \
    libasound2 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libc6 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libexpat1 \
    libfontconfig1 \
    libgbm-dev \
    libgcc1 \
    libgdk-pixbuf2.0-0 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libstdc++6 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    ca-certificates \
    fonts-liberation \
    lsb-release \
    xdg-utils \
    x11vnc \
    x11-xkb-utils \
    xfonts-100dpi \
    xfonts-75dpi \
    xfonts-scalable \
    x11-apps \
    xvfb \
    xauth \
    netcat-openbsd \
    dumb-init \
    wget

RUN curl -L https://codeclimate.com/downloads/test-reporter/test-reporter-latest-linux-amd64 > /cc-test-reporter
RUN chmod +x /cc-test-reporter

# AWS CLI is installed via devcontainer feature (see devcontainer.json)

# Explicitly set CA cert to resolve SSL issues with AWS.
ENV AWS_CA_BUNDLE /etc/ssl/certs/ca-certificates.crt

# Add VA Root CA to Docker Certificate Authority (CA) Store so that NODE can use it for requests.
ADD http://crl.pki.va.gov/PKI/AIA/VA/VA-Internal-S2-RCA1-v1.cer /usr/local/share/ca-certificates/
RUN mv /usr/local/share/ca-certificates/VA-Internal-S2-RCA1-v1.cer /usr/local/share/ca-certificates/VA-Internal-S2-RCA1-v1.cer.crt
RUN update-ca-certificates
# Display VA Internal certificates that are now trusted
RUN awk -v cmd='openssl x509 -noout -subject' '/BEGIN/{close(cmd)};{print | cmd}' < /etc/ssl/certs/ca-certificates.crt | grep -i 'VA-Internal'

# install RVM, Ruby, and Bundler
# RUN \curl -L https://get.rvm.io | bash -s stable
# RUN /bin/bash -l -c "rvm requirements"
# RUN /bin/bash -l -c "rvm install 2.7.6"
# RUN /bin/bash -l -c "gem install bundler --no-ri --no-rdoc"

RUN mkdir -p /application
WORKDIR /application

USER vets-website
ENV NODE_EXTRA_CA_CERTS /etc/ssl/certs/ca-certificates.crt

ENTRYPOINT ["/usr/bin/dumb-init", "--"]
