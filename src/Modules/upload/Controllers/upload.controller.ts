import {
  Controller,
  UseInterceptors,
  Body,
  UploadedFiles,
  Put,
  Post,
  Get,
  Param,
  ParseUUIDPipe,
  Delete,
} from '@nestjs/common';
import { ApiConsumes, ApiBody, ApiTags } from '@nestjs/swagger';
import { UploadService } from '../Services/Upload.service';
import { UpdateUploadRequest } from '../Models/UpdateUploadRequest.entity';
import { ApiHttpResponse } from 'mc-model-types';
import { FilteredFileInterceptorConfiguration } from '../Decorators/FilteredFileInterceptorConfiguration';
import { FilteredFileFieldsInterceptor } from '../Interceptors/FilteredFileFieldsInterceptor';
import { CreateFileFilter } from '../Filters/CreateFileFilter';
import { UpdateFileFilter } from '../Filters/UpdateFileFilter';
import { CreateUploadRequest } from '../Models/CreateUploadRequest.entity';
import { ResponseSchema } from 'mc-nest-schema-validator';
import { IUploadedFiles } from '../Models/IUploadedFiles';

@Controller('upload')
@ApiTags('upload')
export class UploadController {
  constructor(private uploadService: UploadService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @ResponseSchema('Http/ImageMetadataResponse.json')
  @FilteredFileInterceptorConfiguration(
    [{ name: 'file', maxCount: 1 }, { name: 'additionalFiles' }],
    CreateFileFilter
  )
  @UseInterceptors(FilteredFileFieldsInterceptor)
  uploadFile(
    @UploadedFiles() files: IUploadedFiles,
    @Body() request: CreateUploadRequest
  ): ApiHttpResponse {
    return this.uploadService.create(request, files);
  }

  @Get(':id')
  async findFile(
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<ApiHttpResponse> {
    return await this.uploadService.find(id);
  }

  @Put()
  @FilteredFileInterceptorConfiguration(
    [{ name: 'file', maxCount: 1 }, { name: 'additionalFiles' }],
    UpdateFileFilter
  )
  @UseInterceptors(FilteredFileFieldsInterceptor)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: UpdateUploadRequest,
  })
  updateFile(
    @Body() request: UpdateUploadRequest,
    @UploadedFiles() files: IUploadedFiles
  ): ApiHttpResponse {
    return this.uploadService.update(request, files);
  }

  @Delete(':id')
  deleteFile(@Param('id', ParseUUIDPipe) id: string): ApiHttpResponse {
    return this.uploadService.delete(id);
  }
}
