#!/usr/bin/env bash
set -e

#build image
IMAGE_NAME=conversafina-nginx
IMAGE_VERSION=1.0.0

docker build --no-cache --pull -t $IMAGE_NAME:$IMAGE_VERSION -f nginx/Dockerfile ..

#push to ecr
AWS_ACCOUNT_ID=`aws sts get-caller-identity --query Account --output text`
AWS_REGION=us-east-2
AWS_SESSION_TOKEN=`aws ecr get-login-password --region $AWS_REGION`

docker login -u AWS -p $AWS_SESSION_TOKEN $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com
docker tag $IMAGE_NAME:$IMAGE_VERSION $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$IMAGE_NAME:$IMAGE_VERSION
docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$IMAGE_NAME:$IMAGE_VERSION