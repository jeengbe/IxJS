import { AsyncIterableX } from '../asynciterablex.js';
import { MonoTypeOperatorAsyncFunction } from '../../interfaces.js';
import { wrapWithAbort } from './withabort.js';
import { throwIfAborted } from '../../aborterror.js';

/** @ignore */
export class RepeatAsyncIterable<TSource> extends AsyncIterableX<TSource> {
  private _source: AsyncIterable<TSource>;
  private _count: number;

  constructor(source: AsyncIterable<TSource>, count: number) {
    super();
    this._source = source;
    this._count = count;
  }

  async *[Symbol.asyncIterator](signal?: AbortSignal) {
    throwIfAborted(signal);

    // Can't yield* in a loop
    // See: https://github.com/microsoft/TypeScript/issues/61022
    if (this._count === -1) {
      while (1) {
        for await (const item of wrapWithAbort(this._source, signal)) {
          yield item;
        }
      }
    } else {
      for (let i = 0; i < this._count; i++) {
        for await (const item of wrapWithAbort(this._source, signal)) {
          yield item;
        }
      }
    }
  }
}

/**
 * Repeats the async-enumerable sequence a specified number of times.
 *
 * @template TSource The type of the elements in the source sequence.
 * @param {number} [count=-1] Number of times to repeat the sequence. If not specified, the sequence repeats indefinitely.
 * @returns {MonoTypeOperatorAsyncFunction<TSource>} The async-iterable sequence producing the elements of the given sequence repeatedly.
 */
export function repeat<TSource>(count = -1): MonoTypeOperatorAsyncFunction<TSource> {
  return function repeatOperatorFunction(source) {
    return new RepeatAsyncIterable(source, count);
  };
}

export async function tt() {
  function* generate() {
    yield 1;
  }

  async function* repeat() {
    const x = generate();

    while (true) {
      yield* x;
      console.log('repeat');
    }
  }

  const it = repeat()[Symbol.asyncIterator]();
  console.log(await it.next());
  await it.return?.();
}
