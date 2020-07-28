import { S3 } from 'aws-sdk';
import * as _ from 'lodash';
import * as multer from 'multer';
import * as multerS3 from 'multer-s3';
import { MCLogger } from '@map-colonies/mc-logger';
import { ConfigService } from '../../configuration/ConfigService';

export class S3StorageBuilder {
  private s3Client;
  private bucket;

  constructor(private config: ConfigService, private logger: MCLogger) {
    this.s3Client = this.createS3Client();
    this.bucket = this.config.get('storage.S3.bucket');
  }

  private createS3Client(): S3 {
    return new S3({
      endpoint: this.config.get('storage.S3.endpoint'),
      accessKeyId: this.config.get('storage.S3.accessKeyId'),
      secretAccessKey: this.config.get('storage.S3.secretAccessKey'),
      region: this.config.get('storage.S3.region'),
      sslEnabled: this.config.get<boolean>('storage.S3.sslEnabled'),
      s3ForcePathStyle: true,
      apiVersion: this.config.get('storage.S3.apiVersion'),
      signatureVersion: this.config.get('storage.S3.signatureVersion'),
    });
  }

  CreateStorage(): multer.StorageEngine {
    this.s3Client
      .listBuckets()
      .promise()
      .then(data => {
        this.createBucketIfNotExists(data, this.bucket);
      })
      .catch(err => {
        this.logger.error(
          'S3StorageBuilder - CreateStorage - failed to get buckets list from object storage: %s',
          err.message
        );
        process.exit(1);
      });

    return multerS3({
      s3: this.s3Client,
      bucket: (req, file, cb) => {
        cb(null, this.bucket);
      },
      key: (req, file, cb) => {
        this.createUploadKey(req, file, cb);
      },
    });
  }

  private createBucketIfNotExists(data, bucket) {
    if (
      _.findIndex(data.Buckets, b => {
        return b.Name === bucket;
      }) === -1
    ) {
      this.logger.info(
        `S3StorageBuilder - CreateBucketIfNotExists - bucket '${bucket}' does not exist in object storage`
      );
      this.s3Client
        .createBucket({ Bucket: bucket })
        .promise()
        .then(res => {
          this.logger.info(
            `S3StorageBuilder - CreateBucketIfNotExists - created new bucket:  ${bucket}`
          );
        })
        .catch(err => {
          this.logger.error(
            `S3StorageBuilder - CreateBucketIfNotExists - can\'t create bucket, failed with error: ${err}`
          );
          process.exit(1);
        });
    }
  }

  private createUploadKey(req, file: Express.Multer.File, cb) {
    const fileId = JSON.parse(req.body.additionalData).id;
    const productDir = `${fileId}`;

    req.body.uploadDir = 's3://' + this.bucket + '/' + productDir;
    const key = productDir + '/' + file.originalname;
    this.logger.info(
      `S3StorageBuilder - CreateUploadKey - Uploading file to path: ${req.body.uploadDir}/${file.originalname}`
    );

    cb(null, key);
  }
}
