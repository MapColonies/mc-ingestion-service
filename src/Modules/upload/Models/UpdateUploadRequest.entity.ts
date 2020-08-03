import { ApiProperty } from '@nestjs/swagger';
import { ImageMetadata } from '@map-colonies/mc-model-types';
import { PropertySchema } from '@map-colonies/mc-nest-schema-validator';
import { IsOptional, ValidateNested, IsDefined } from 'class-validator';
import { TransformMultipartObject } from '../Decorators/TransformMultipartObject';

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
