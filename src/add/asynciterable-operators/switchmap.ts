import { AsyncIterableX } from '../../asynciterable/asynciterablex.js';
import { switchMap } from '../../asynciterable/operators/switchmap.js';

/**
 * @ignore
 */
export function switchMapProto<T, R extends AsyncIterable<any>>(
  this: AsyncIterableX<T>,
  selector: (value: T, index: number, signal?: AbortSignal) => R | Promise<R>,
  thisArg?: any
) {
  return switchMap<T, R>(selector, thisArg)(this);
}

AsyncIterableX.prototype.switchMap = switchMapProto;

declare module '../../asynciterable/asynciterablex' {
  interface AsyncIterableX<T> {
    switchMap: typeof switchMapProto;
  }
}
