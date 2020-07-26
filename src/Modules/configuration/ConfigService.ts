import * as config from 'config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {
  get<T = string>(key: string, defaultValue?: T): T {
    return this.has(key) ? config.get<T>(key) : defaultValue;
  }

  has(key: string): boolean {
    return config.has(key);
  }
}
