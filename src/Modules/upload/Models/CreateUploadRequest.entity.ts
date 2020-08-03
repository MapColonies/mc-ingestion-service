import { ApiProperty } from '@nestjs/swagger';
import { ImageMetadata } from '@map-colonies/mc-model-types';
import { PropertySchema } from '@map-colonies/mc-nest-schema-validator';
import { IsDefined, IsOptional, ValidateNested } from 'class-validator';
import { TransformMultipartObject } from '../Decorators/TransformMultipartObject';

export class CreateUploadRequest {
  @IsDefined()
  @TransformMultipartObject(Object)
  @ValidateNested({ each: true })
  @PropertySchema('ImageMetadata/ImageMetadata-Create.json')
  additionalData: ImageMetadata;

  //files are validated in multer file filter
  @ApiProperty({
    description: 'the main data file to upload',
    type: 'file',
    required: true,
  })
  file: any;

  @ApiProperty({
    description: 'additional files to upload with the main data file',
    type: 'array',
    items: {
      type: 'file',
    },
  })
  @IsOptional()
  additionalFiles: any[];
}
