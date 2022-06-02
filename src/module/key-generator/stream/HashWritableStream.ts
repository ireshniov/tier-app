import { Writable, WritableOptions } from 'stream';
import { KeyGeneratorCacheService } from '../service';

export class HashWritableStream extends Writable {
  constructor(
    private keyGeneratorCacheService: KeyGeneratorCacheService,
    options?: WritableOptions,
  ) {
    super(options);
  }

  async _write(chunk: string[], _encoding: BufferEncoding, callback) {
    await this.keyGeneratorCacheService.addHashes(chunk);

    callback(null);
  }
}
