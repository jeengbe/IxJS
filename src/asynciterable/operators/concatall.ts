import { AsyncIterableX } from '../asynciterablex.js';
import { OperatorAsyncFunction } from '../../interfaces.js';
import { wrapWithAbort } from './withabort.js';
import { throwIfAborted } from '../../aborterror.js';

/** @ignore */
export class ConcatAllAsyncIterable<TSource> extends AsyncIterableX<TSource> {
  private _source: AsyncIterable<AsyncIterable<TSource>>;

  constructor(source: AsyncIterable<AsyncIterable<TSource>>) {
    super();
    this._source = source;
  }

  async *[Symbol.asyncIterator](signal?: AbortSignal) {
    throwIfAborted(signal);

    for await (const inner of wrapWithAbort(this._source, signal)) {
      yield* wrapWithAbort(inner, signal);
    }
  }
}

/**
 * Concatenates all inner async-iterable sequences, as long as the previous
 * async-iterable sequence terminated successfully.
 *
 * @template T The type of elements in the source sequence.
 * @returns {OperatorAsyncFunction<AsyncIterable<T>, T>} An operator which concatenates all inner async-iterable sources.
 */
export function concatAll<T>(): OperatorAsyncFunction<AsyncIterable<T>, T> {
  return function concatAllOperatorFunction(source) {
    return new ConcatAllAsyncIterable(source);
  };
}
