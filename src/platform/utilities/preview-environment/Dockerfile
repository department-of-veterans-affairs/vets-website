FROM public.ecr.aws/bitnami/node:14.15.5

RUN apt-get update
RUN apt-get install -y -t testing poppler-utils
RUN apt-get install -y ca-certificates-java && dpkg --configure -a && apt-get install -y build-essential libpq-dev git imagemagick curl wget ca-certificates-java pdftk file \
  && apt-get clean \
  && rm -rf /var/cache/apt/archives/* /var/lib/apt/lists/* /tmp/* /var/tmp/

# Download VA Certs
COPY ./src/platform/utilities/preview-environment/import-va-certs.sh .
RUN chmod +x import-va-certs.sh
RUN ./import-va-certs.sh

# Copy startup script into place
COPY src/platform/utilities/preview-environment/start.sh .
RUN chmod +x start.sh

# Expose ports
EXPOSE 3001
EXPOSE 3002

ARG AWS_URL
ENV AWS_URL $AWS_URL

ARG SOURCE_REF
ENV SOURCE_REF $SOURCE_REF

# Configure image to execute a script on startup with ENTRYPOINT/CMD
ENTRYPOINT ["./start.sh"]
CMD ["$AWS_URL", "$SOURCE_REF"]
