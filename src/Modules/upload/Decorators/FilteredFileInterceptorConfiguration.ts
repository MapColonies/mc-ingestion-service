import { SetMetadata, applyDecorators, Type } from '@nestjs/common';
import { MulterField } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { IFileFilter } from '../Models/IFileFilter';
import {
  FILE_FILTER_KEY,
  FILE_UPLOAD_FILEDS_KEY,
} from '../../../Common/Constants';

export const FilteredFileInterceptorConfiguration = (
  multerFields: MulterField[],
  filter: Type<IFileFilter>
): any =>
  applyDecorators(
    SetMetadata(FILE_UPLOAD_FILEDS_KEY, multerFields),
    SetMetadata(FILE_FILTER_KEY, filter)
  );
