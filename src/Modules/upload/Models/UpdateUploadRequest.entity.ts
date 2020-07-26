import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, ValidateNested, IsDefined } from 'class-validator';
import { ImageMetadata } from 'mc-model-types';
import { TransformMultipartObject } from '../Decorators/TransformMultipartObject';
import { PropertySchema } from 'mc-nest-schema-validator';

export class UpdateUploadRequest {
  @IsDefined()
  @TransformMultipartObject(Object)
  @ValidateNested({ each: true })
  @PropertySchema('ImageMetadata/ImageMetadata-Update.json')
  additionalData: ImageMetadata;

  @ApiProperty({ type: 'file', description: 'the main data file to upload' })
  file: any;

  @ApiProperty({
    type: 'file',
    description: 'additional files to upload with the main data file',
  })
  @IsOptional()
  additionalFiles: any[];
}
