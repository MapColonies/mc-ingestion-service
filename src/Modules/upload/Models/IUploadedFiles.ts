type File = Express.MulterS3.File;
export interface IUploadedFiles {
  file: File[];
  additionalFiles: File[];
}
