FROM public.ecr.aws/bitnami/node:14.15.5

# Copy startup script into place
COPY src/platform/utilities/preview-environment/start.sh .
RUN chmod +x start.sh

# Expose ports
EXPOSE 3001
EXPOSE 3002

ARG AWS_URL
ENV AWS_URL $AWS_URL

# Configure image to execute a script on startup with ENTRYPOINT/CMD
ENTRYPOINT ["./start.sh"]
CMD ["$AWS_URL"]
