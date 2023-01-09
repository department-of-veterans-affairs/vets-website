# based on https://github.com/nodejs/docker-node/blob/master/4.7/slim/Dockerfile

FROM public.ecr.aws/bitnami/node:14.15.5

# RUN git clone https://github.com/department-of-veterans-affairs/content-build

RUN mkdir vets-website

COPY . ./vets-website

# EXPOSE 3002
EXPOSE 3001
EXPOSE 3000

CMD cd vets-website; yarn install;ls; yarn watch --port=3001 --host=0.0.0.0 
