import { S3Client, ListBucketsCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";

dotenv.config();

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});

try {
  const data = await s3.send(new ListBucketsCommand({}));
  console.log("✅ SUCCESS:", data);
} catch (err) {
  console.error("❌ ERROR:", err);
}