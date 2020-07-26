import multer from 'multer';

export interface IFileFilter {
  filter(
    req: any,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
  ): Promise<void>;
}
