const AWS = require("aws-sdk");
const fs = require("fs");
const path = require("path");

require("dotenv").config();

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const uploadFile = (filePath) => {
  const fileContent = fs.readFileSync(filePath);
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: path.basename(filePath),
    Body: fileContent,
    ACL: "public-read",
  };

  return s3.upload(params).promise();
};
