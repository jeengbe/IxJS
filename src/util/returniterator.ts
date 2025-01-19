/**
 * @ignore
 */
export function returnIterator<T>(it: Iterator<T>) {
  if (typeof it?.return === 'function') {
    it.return();
  }
}

/**
 * @ignore
 */
export async function returnAsyncIterators(iterators: AsyncIterator<unknown>[]): Promise<void> {
  for (const iterator of iterators) {
    // The other generators may not be suspended (executing but stuck in an await instead), so awaiting
    // a return call may not do anything. Instead, we need to cancel the
    // TODO: Send a signal to the other iterators to stop
    void iterator.return?.();
  }
}
