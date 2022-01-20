# based on https://github.com/nodejs/docker-node/blob/master/4.7/slim/Dockerfile

FROM public.ecr.aws/bitnami/node:14.15.5

# default case is Jenkins, but we want to be able to overwrite this
ARG userid=504
RUN groupadd -g $userid vets-website \
  && useradd -u $userid -r -m -d /application -g vets-website vets-website

ENV YARN_VERSION 1.21.1
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
                                                fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils \
                                                x11vnc x11-xkb-utils xfonts-100dpi xfonts-75dpi xfonts-scalable \
                                                xfonts-cyrillic x11-apps xvfb xauth netcat dumb-init libgbm-dev

RUN curl -L https://codeclimate.com/downloads/test-reporter/test-reporter-latest-linux-amd64 > /cc-test-reporter
RUN chmod +x /cc-test-reporter

RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
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

ENTRYPOINT ["/usr/bin/dumb-init", "--"]
