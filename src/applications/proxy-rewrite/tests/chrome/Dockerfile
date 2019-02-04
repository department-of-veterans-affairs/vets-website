# Based on https://github.com/GoogleChrome/puppeteer/issues/1645#issuecomment-356060348
FROM krallin/ubuntu-tini:xenial

EXPOSE 9222

# Install dependencies
RUN apt-get update && \
  apt-get -y upgrade && \
  apt-get install -yq curl libgconf-2-4

# Install Google Chrome
RUN curl https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - && \
  echo 'deb [arch=amd64] http://dl.google.com/linux/chrome/deb stable main' >> /etc/apt/sources.list.d/google-chrome.list && \
  apt-get update && \
  apt-get install -y google-chrome-unstable --no-install-recommends && \
  rm -fr /var/lib/apt/lists/* && \
  apt-get purge --auto-remove -y curl && \
  rm -fr /src/*.deb

COPY ./puppeteer-entrypoint.sh .
RUN chmod +x ./puppeteer-entrypoint.sh

ENTRYPOINT ["/usr/local/bin/tini", "--", "./puppeteer-entrypoint.sh"]