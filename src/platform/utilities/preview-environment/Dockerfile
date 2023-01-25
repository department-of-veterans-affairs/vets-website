FROM public.ecr.aws/bitnami/node:14.15.5

RUN mkdir vets-website

COPY . ./vets-website


RUN ls ./vets-website

EXPOSE 3001
EXPOSE 3000

CMD cd vets-website; yarn install;ls; yarn watch --port=3001 --host=0.0.0.0
