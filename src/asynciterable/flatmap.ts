'use strict';

import { AsyncIterableX } from '../asynciterable';
import { bindCallback } from '../internal/bindcallback';

class FlatMapAsyncIterable<TSource, TResult> extends AsyncIterableX<TResult> {
  private _source: AsyncIterable<TSource>;
  private _selector: (value: TSource) => Iterable<TResult | PromiseLike<TResult>> | AsyncIterable<TResult>;

  constructor(
    source: AsyncIterable<TSource>,
    selector: (value: TSource) => Iterable<TResult | PromiseLike<TResult>> | AsyncIterable<TResult>) {
    super();
    this._source = source;
    this._selector = selector;
  }

  async *[Symbol.asyncIterator]() {
    for await (let outer of <AsyncIterable<TSource>>(this._source)) {
      for await (let inner of <AsyncIterable<TResult>>(this._selector(outer))) {
        yield inner;
      }
    }
  }
}

export function flatMap<TSource, TResult>(
    source: AsyncIterable<TSource>,
    selector: (value: TSource) => Iterable<TResult | PromiseLike<TResult>> | AsyncIterable<TResult>,
    thisArg?: any): AsyncIterableX<TResult> {
  return new FlatMapAsyncIterable<TSource, TResult>(source, bindCallback(selector, thisArg, 1));
}