/**
 * Iterator
 *
 * @example
 * var myArray = ["pippo", "pluto", "paperino"];
 * var it = Iterator(myArray);
 * it.next().value === "pippo"; //true
 * it.next().value === "pluto"; //true
 * it.next(true).value === "paperino" //false because with true you can reset it!
 * @param {Array} array - the array you want to transform in iterator
 * @returns {Object} - an iterator-like object
 * */
export default function Iterator(array) {
  let nextIndex = 0;

  return {
    next: reset => {
      if (reset) { nextIndex = 0; }
      return nextIndex < array.length ?
          { value: array[nextIndex++], done: false } :
          { done: true };
    }
  };
}
