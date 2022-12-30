# based on https://github.com/nodejs/docker-node/blob/master/4.7/slim/Dockerfile

FROM public.ecr.aws/bitnami/node:14.15.5

# RUN git clone https://github.com/department-of-veterans-affairs/content-build

RUN mkdir vets-website

COPY . ./vets-website

EXPOSE 3001

CMD cd vets-website; yarn install;ls; yarn watch

