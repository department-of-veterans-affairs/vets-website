FROM public.ecr.aws/bitnami/node:14.15.5



RUN mkdir -p /website
WORKDIR /website

# Clone vagov-content
RUN git clone --depth 1 https://github.com/department-of-veterans-affairs/vagov-content

# Clone vets-gov-json schema
RUN git clone --depth 1 https://github.com/department-of-veterans-affairs/vets-json-schema.git

# Clone veteran-facing-services-tools
RUN git clone --depth 1 https://github.com/department-of-veterans-affairs/veteran-facing-services-tools

# Clone content-build
RUN git clone --depth 1 https://github.com/department-of-veterans-affairs/content-build.git

# Setup a working directory for vets-website
RUN mkdir -p /website/vets-website
WORKDIR /website/vets-website

# Copy vets-website files into Docker image
COPY . .

# Copy startup script into place
COPY src/platform/utilities/preview-environment/start.sh .
RUN chmod +x start.sh

ARG AWS_URL
ENV AWS_URL $AWS_URL

RUN echo "The content url is: $AWS_URL"

# Expose ports
EXPOSE 3001
EXPOSE 3002

# Configure image to execute a script on startup with ENTRYPOINT/CMD
CMD ["./start.sh"]
