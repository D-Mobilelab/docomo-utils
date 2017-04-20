/**
 * Simple memoization function
 * @export
 * @param {Function} fn
 * @returns {any} what the real function returns
 */
export default function memoize(fn) {
  const cache = {};
  return function memoized() {
    const key = JSON.stringify([].slice.call(arguments));
    if (key in cache) {
      return cache[key];
    }
    cache[key] = fn.apply(this, arguments);
    return cache[key];
  };
}
