# XXX: using stretch here for pdftk dep, which is not availible after
#      stretch (or in alpine) and is switched automatically to pdftk-java in buster
#      https://github.com/department-of-veterans-affairs/va.gov-team/issues/3032

###
# shared build/settings for all child images, reuse these layers yo
###
FROM ruby:2.7.6-slim-bullseye AS base

ARG userid=993
SHELL ["/bin/bash", "-c"]
RUN groupadd -g $userid -r vets-api && \
    useradd -u $userid -r -m -d /srv/vets-api -g vets-api vets-api
RUN echo "deb http://ftp.debian.org/debian testing main contrib non-free" >> /etc/apt/sources.list
RUN apt-get update
RUN apt-get install -y -t testing poppler-utils
RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y \
    dumb-init clamav clamdscan clamav-daemon imagemagick pdftk curl libpq5 vim libboost-all-dev

# The pki work below is for parity with the non-docker BRD deploys to mount certs into
# the container, we need to get rid of it and refactor the configuration bits into
# something more continer friendly in a later bunch of work
RUN mkdir -p /srv/vets-api/{clamav/database,pki/tls,secure,src} && \
    chown -R vets-api:vets-api /srv/vets-api && \
    ln -s /srv/vets-api/pki /etc/pki
# XXX: get rid of the CA trust manipulation when we have a better model for it
COPY config/ca-trust/* /usr/local/share/ca-certificates/
# rename .pem files to .crt because update-ca-certificates ignores files that are not .crt
RUN cd /usr/local/share/ca-certificates ; for i in *.pem ; do mv $i ${i/pem/crt} ; done ; update-ca-certificates
# Relax ImageMagick PDF security. See https://stackoverflow.com/a/59193253.
RUN sed -i '/rights="none" pattern="PDF"/d' /etc/ImageMagick-6/policy.xml
WORKDIR /srv/vets-api/src

###
# dev stage; use --target=development to stop here
# Be sure to pass required ARGs as `--build-arg`
# This stage useful for mounting your local checkout with compose
# into the container to dev against.
###
FROM base AS development

ARG sidekiq_license
ARG rails_env=development

ENV BUNDLE_ENTERPRISE__CONTRIBSYS__COM=$sidekiq_license
ENV RAILS_ENV=$rails_env

# only extra dev/build opts go here, common packages go in base 👆
RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y \
    git build-essential libxml2-dev libxslt-dev libpq-dev
COPY --chown=vets-api:vets-api config/freshclam.conf docker-entrypoint.sh ./
USER vets-api
# XXX: this is tacky
RUN freshclam --config-file freshclam.conf
RUN gem install vtk
ENTRYPOINT ["/usr/bin/dumb-init", "--", "./docker-entrypoint.sh"]

###
# build stage; use --target=builder to stop here
# Also be sure to add build-args from development stage above
#
# This is development with the app copied in and built.  The build results are used in
# prod below, but also useful if you want to have a container with the app and not
# mount your local checkout.
###
FROM development AS builder
# XXX: move modules/ to seperate repos so we can only copy Gemfile* and install a slim layer
ARG bundler_opts
COPY --chown=vets-api:vets-api . .
USER vets-api
# --no-cache doesn't do the right thing, so trim it during build
# https://github.com/bundler/bundler/issues/6680
RUN bundle install --binstubs="${BUNDLE_APP_CONFIG}/bin" $bundler_opts && \
    find ${BUNDLE_APP_CONFIG}/cache -type f -name \*.gem -delete

###
# prod stage; default if no target given
# to build prod you probably want options like below to get a good build
# --build-arg sidekiq_license="$BUNDLE_ENTERPRISE__CONTRIBSYS__COM" --build-arg rails_env=production --build-arg bundler_opts="--no-cache --without development test"
# This inherits from base again to avoid bringing in extra built time binary packages
###
FROM base AS production

ENV RAILS_ENV=production
COPY --from=builder $BUNDLE_APP_CONFIG $BUNDLE_APP_CONFIG
COPY --from=builder --chown=vets-api:vets-api /srv/vets-api/src ./
COPY --from=builder --chown=vets-api:vets-api /srv/vets-api/clamav/database ../clamav/database
RUN if [ -d certs-tmp ] ; then cd certs-tmp ; for i in * ; do cp $i /usr/local/share/ca-certificates/${i/pem/crt} ; done ; fi && update-ca-certificates
USER vets-api
ENTRYPOINT ["/usr/bin/dumb-init", "--", "./docker-entrypoint.sh"]
