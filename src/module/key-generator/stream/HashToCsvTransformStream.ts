import { Transform, TransformOptions } from 'stream';
import { ObjectCsvStringifier } from 'csv-writer/src/lib/csv-stringifiers/object';
import { createObjectCsvStringifier } from 'csv-writer';
import { IHash } from '../interface';

export class HashToCsvTransformStream extends Transform {
  private readonly csvStringifier: ObjectCsvStringifier;

  constructor(options?: TransformOptions) {
    super(options);

    this.csvStringifier = createObjectCsvStringifier({
      header: [{ id: 'hash', title: 'hash' }],
    });
  }

  _transform(
    chunk: IHash[],
    _encoding: string,
    callback: (error?: Error | null, data?: any) => void,
  ): void {
    const csv: string = this.csvStringifier.stringifyRecords(chunk);

    this.push(csv);

    callback();
  }
}
