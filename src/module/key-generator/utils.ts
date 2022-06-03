import { IHash } from './interface';

export function* product(
  chars: string,
  times: number,
): IterableIterator<string[]> {
  const pool = Array.from(chars);
  const pools = Array(times).fill(pool);

  let i = 0;
  const indexes = new Array(pools.length).fill(0);
  const result = indexes.map((x, i) => pools[i][x]);
  indexes[0] = -1;
  while (i < indexes.length) {
    if (indexes[i] < pools[i].length - 1) {
      indexes[i]++;
      result[i] = pools[i][indexes[i]];
      i = 0;

      yield result;
    } else {
      indexes[i] = 0;
      result[i] = pools[i][0];
      i++;
    }
  }
}

export function* chunkHashes(
  iterable: IterableIterator<string[]>,
  maxSize: number,
): IterableIterator<IHash[]> {
  let result: IHash[] = [];

  let nxt = iterable.next();

  while (!nxt.done) {
    if (result.length === maxSize) {
      yield result;
      result = [];
    }

    result.push({ hash: nxt.value.join('') });
    nxt = iterable.next();
  }

  if (result.length > 0) {
    yield result;
  }
}

export function createHashesIterable(
  hashLength: number,
  maxSize: number,
): IterableIterator<IHash[]> {
  return chunkHashes(
    product(
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
      hashLength,
    ),
    maxSize,
  );
}
