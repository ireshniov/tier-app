import {
  Readable,
  ReadableOptions,
  TransformOptions,
  WritableOptions,
} from 'stream';
import { HashReadableStream } from './HashReadableStream';
import { HashWritableStream } from './HashWritableStream';
import { IHash } from '../interface';
import { KeyGeneratorCacheService } from '../service';
import { HashToCsvTransformStream } from './HashToCsvTransformStream';
import { createHashesIterable } from '../utils';

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

  static createHashToCsvTransformStream(
    options: TransformOptions = { objectMode: true },
  ): HashToCsvTransformStream {
    return new HashToCsvTransformStream(options);
  }

  static createGeneratedHashReadableStream(
    hashLength: number,
    maxSize = 1000,
  ): Readable {
    const iterable = createHashesIterable(hashLength, maxSize);

    return Readable.from(iterable);
  }
}
