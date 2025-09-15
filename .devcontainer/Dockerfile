# See here for image contents: https://github.com/microsoft/vscode-dev-containers/tree/v0.192.0/containers/javascript-node/.devcontainer/base.Dockerfile

# [Choice] Node.js version: 16, 14, 12
ARG VARIANT="14-buster"
FROM mcr.microsoft.com/vscode/devcontainers/javascript-node:0-${VARIANT}

# default case is Jenkins, but we want to be able to overwrite this
ARG userid=504
RUN groupadd -g $userid vets-website \
  && useradd -u $userid -r -m -d /application -g vets-website vets-website

ENV YARN_VERSION 1.22.19
ENV NODE_ENV production

RUN apt-get update

# Install specific version of Chrome to match ChromeDriver installation.
ENV CHROME_VERSION 91.0.4472.101-1
RUN curl -L "https://github.com/webnicer/chrome-downloads/raw/master/x64.deb/google-chrome-stable_${CHROME_VERSION}_amd64.deb" -o "google-chrome.deb"
RUN dpkg -i google-chrome.deb || apt-get -f -y install

RUN apt-get install -y --no-install-recommends gconf-service libasound2 libatk1.0-0 libc6 libcairo2 \
                                                                 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 \
                                                                 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 \
                                                                 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 \
                                                                 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 \
                                                                 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 \
                                                libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates \
                                                fonts-liberation libnss3 lsb-release xdg-utils \
                                                x11vnc x11-xkb-utils xfonts-100dpi xfonts-75dpi xfonts-scalable \
                                                xfonts-cyrillic x11-apps xvfb xauth netcat dumb-init libgbm-dev \
                                                && wget http://http.us.debian.org/debian/pool/main/liba/libappindicator/libappindicator1_0.4.92-7_amd64.deb -O /tmp/libappindicator1_0.4.92-7_amd64.deb \
                                                && wget http://http.us.debian.org/debian/pool/main/libi/libindicator/libindicator7_0.5.0-4_amd64.deb -O /tmp/libindicator7_0.5.0-4_amd64.deb \
                                                && apt-get install -y  /tmp/libindicator7_0.5.0-4_amd64.deb /tmp/libappindicator1_0.4.92-7_amd64.deb

RUN curl -L https://codeclimate.com/downloads/test-reporter/test-reporter-latest-linux-amd64 > /cc-test-reporter
RUN chmod +x /cc-test-reporter

RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
RUN unzip awscliv2.zip
RUN ./aws/install
RUN aws --version # Verify AWS CLI installation.

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
