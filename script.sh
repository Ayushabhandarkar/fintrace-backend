#!/bin/bash

# Set variables
S3_BUCKET="fintrace-bucket"

# Delete all files in the S3 bucket
echo "Deleting all files in S3 bucket..."
aws s3 rm s3://$S3_BUCKET --recursive

# Update the Lambda function using Claudia.js
echo "Updating the Lambda function..."
claudia update --handler lambda.handler \
  --deploy-proxy-api \
  --region ap-south-1 \
  --use-s3-bucket $S3_BUCKET \
  --runtime nodejs20.x \
  --timeout 360 \
  --memory 512

echo "Deployment completed!"
