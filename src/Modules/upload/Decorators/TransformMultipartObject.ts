import { applyDecorators, BadRequestException } from '@nestjs/common';
import { Transform, deserialize } from 'class-transformer';
import { ClassType } from 'class-transformer/ClassTransformer';

export function TransformMultipartObject(cls: ClassType<unknown>): any {
  const transformer = value => {
    try {
      return deserialize(cls, value);
    } catch {
      throw new BadRequestException(null, 'invalid JSON');
    }
  };

  return applyDecorators(Transform(transformer));
}
