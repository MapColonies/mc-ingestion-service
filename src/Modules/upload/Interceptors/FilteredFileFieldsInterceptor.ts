import {
  MulterField,
  MulterOptions,
} from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Injectable,
  Type,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Observable } from 'rxjs';
import { Reflector, ModuleRef } from '@nestjs/core';
import { IFileFilter } from '../Models/IFileFilter';
import { StorageEngineFactory } from '../../storage/StorageEngineFactory';
import { ConfigService } from '../../configuration/ConfigService';
import { Logger } from '../../logger/Logger';
import {
  FILE_FILTER_KEY,
  FILE_UPLOAD_FILEDS_KEY,
} from '../../../Common/Constants';

@Injectable()
export class FilteredFileFieldsInterceptor implements NestInterceptor {
  constructor(
    private moduleRef: ModuleRef,
    private reflector: Reflector,
    private config: ConfigService,
    private logger: Logger,
    private se: StorageEngineFactory
  ) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>
  ): Observable<any> | Promise<Observable<any>> {
    const filterType = this.reflector.get<Type<IFileFilter>>(
      FILE_FILTER_KEY,
      context.getHandler()
    );
    const filter = this.moduleRef.get(filterType);
    const storage = this.se.getStorage(this.config, this.logger);
    const localOptions: MulterOptions = {
      fileFilter: filter.filter.bind(filter),
      storage: storage,
    };
    const uploadFields = this.reflector.get<MulterField[]>(
      FILE_UPLOAD_FILEDS_KEY,
      context.getHandler()
    );
    const interceptorType = FileFieldsInterceptor(uploadFields, localOptions);
    const interceptor = new interceptorType();
    return interceptor.intercept(context, next);
  }
}
