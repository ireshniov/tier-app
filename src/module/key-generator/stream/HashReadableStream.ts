import { Readable, ReadableOptions } from 'stream';
import { IHash } from '../interface';

export class HashReadableStream extends Readable {
  constructor(private results: IHash[], options?: ReadableOptions) {
    super(options);
  }

  async _read(size: number): Promise<void> {
    try {
      if (!this.results.length) {
        this.push(null);
        return;
      }

      const chunk = this.results.slice(0, size);
      this.results = this.results.slice(size, this.results.length);

      const rows: string[] = chunk.map((value: IHash) => value.hash);

      this.push(rows);
    } catch (error: any) {
      this.push(null);
      this.destroy(error);
    }
  }
}
