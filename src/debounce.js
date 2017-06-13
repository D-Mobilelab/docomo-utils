/**
 * Debounce. Wait ms to execute a function
 * @param {Function} fn - the function to be wrapped
 * @param {Number} [ms = 300] - the number of ms to wait
 * @param {Boolean} immediate - execute immediate and wait ms. If false only the last call
 * @param {Object} [context=this] - the this object. default to this-generated function
 * @returns {Function} returns the function decorated
 */
export default function debounce(fn, ms = 300, immediate, scope) {
  let timeoutID;
  let theFn;
  return function () {
    const context = scope || this;
    const args = [].slice.call(arguments);
    theFn = function () {
      timeoutID = null;
      if (!immediate) return fn.apply(context, args);
    };
    const callNow = immediate && !timeoutID;
    clearTimeout(timeoutID);
    timeoutID = setTimeout(theFn, ms);
    if (callNow) return fn.apply(context, args);
  };
}
