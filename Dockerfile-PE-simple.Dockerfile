# based on https://github.com/nodejs/docker-node/blob/master/4.7/slim/Dockerfile

FROM public.ecr.aws/bitnami/node:14.15.5

RUN mkdir vets-website

COPY . ./vets-website

RUN git clone https://github.com/department-of-veterans-affairs/vagov-content
RUN git clone https://github.com/department-of-veterans-affairs/content-build
RUN git clone https://github.com/department-of-veterans-affairs/vets-json-schema
RUN git clone https://github.com/department-of-veterans-affairs/veteran-facing-services-tools

EXPOSE 3002
EXPOSE 3001
EXPOSE 3000

CMD cd vets-website; yarn install; yarn build; cd ../content-build; yarn install; cp .env.example .env; yarn fetch-drupal-cache; yarn build; npx http-server . -p 3002 --host=0.0.0.0 