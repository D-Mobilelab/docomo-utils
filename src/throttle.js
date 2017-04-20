/**
 * Throttle. Useful for resize event or scroll
 * @param {Function} fn - the function to be wrapped
 * @param {Number} [limit=300] - only x call for ms
 * @returns {Function} returns the function decorated
 */
export default function throttle(fn, limit = 300) {
  let wait = false;
  return function () {
    const context = this;
    const args = [].slice.call(arguments);
    if (!wait) {
      const toReturn = fn.apply(context, args);
      wait = true;
      setTimeout(function () {
        wait = false;
      }, limit);
      return toReturn;
    }
  };
}
