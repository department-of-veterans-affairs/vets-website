FROM public.ecr.aws/docker/library/node:22.22.0-bookworm

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
