FROM public.ecr.aws/bitnami/node:14.15.5

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

# Add VA Root CA to Docker Certificate Authority (CA) Store so that NODE can use it for requests.
ADD https://raw.githubusercontent.com/department-of-veterans-affairs/platform-va-ca-certificate/main/VA-Internal-S2-RCA1-v1.cer /usr/local/share/ca-certificates/
RUN openssl x509 -inform DER -in /usr/local/share/ca-certificates/VA-Internal-S2-RCA1-v1.cer -out /usr/local/share/ca-certificates/VA-Internal-S2-RCA1-v1.crt
RUN update-ca-certificates

ENV NODE_EXTRA_CA_CERTS /etc/ssl/certs/ca-certificates.crt

# Configure image to execute a script on startup with ENTRYPOINT/CMD
ENTRYPOINT ["./start.sh"]
CMD ["$AWS_URL", "$SOURCE_REF"]
