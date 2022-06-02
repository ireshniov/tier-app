import { ReadableOptions, WritableOptions } from 'stream';
import { HashReadableStream } from './HashReadableStream';
import { HashWritableStream } from './HashWritableStream';
import { IHash } from '../interface';
import { KeyGeneratorCacheService } from '../service';

export class HashStreamFactory {
  static createHashReadableStream(
    results: IHash[],
    options: ReadableOptions = { objectMode: true, highWaterMark: 500 },
  ): HashReadableStream {
    return new HashReadableStream(results, options);
  }

  static createHashWritableStream(
    keyGeneratorCacheService: KeyGeneratorCacheService,
    options: WritableOptions = { objectMode: true },
  ): HashWritableStream {
    return new HashWritableStream(keyGeneratorCacheService, options);
  }
}
