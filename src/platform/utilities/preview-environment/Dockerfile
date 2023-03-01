FROM public.ecr.aws/bitnami/node:14.15.5

RUN mkdir vets-website

COPY . ./vets-website

RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
RUN unzip awscliv2.zip
RUN ./aws/install
RUN aws --version # Verify AWS CLI installation.


EXPOSE 3001
EXPOSE 3000

CMD cd vets-website; yarn install;ls; yarn watch --port=3001 --host=0.0.0.0; aws s3 cp s3://vetsgov-website-builds-s3-upload/content-build/0008051ce15e731cc01289933dfb060d6f0d4df6/vagovdev.tar.bz2 ./content-build
