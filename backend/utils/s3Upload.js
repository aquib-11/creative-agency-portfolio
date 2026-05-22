import fs from "fs";
import s3 from "./s3.config.js";
import { Upload } from "@aws-sdk/lib-storage";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";


export const uploadToS3 = async (file, folder = "general") => {
  try {
    const fileStream = fs.createReadStream(file.path);

    const key = `${folder}/${Date.now()}-${file.originalname}`;

    const upload = new Upload({
      client: s3,
      params: {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
        Body: fileStream,
        ContentType: file.mimetype,
      },
    });

    const result = await upload.done();

    return {
      url: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
      key,
    };
  } catch (error) {
    throw new Error("S3 Upload Failed: " + error.message);
  }
};

export const deleteFromS3 = async (key) => {
  try {
    await s3.send(
      new DeleteObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
      })
    );
  } catch (error) {
    throw new Error("S3 Delete Failed: " + error.message);
  }
};