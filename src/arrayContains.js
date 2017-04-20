/**
 * Returns true if the first array is
 * contained in the second one.
 * @example arrayContains([1,2,3] [4,5,6,1,2,3]) // true
 * Works even with array of objects and string
 * @param {Array|String} first
 * @param {Array|String} second
 * @returns {Boolean}
 */
export default function arrayContains(first, second) {
  if (first.length > second.length) {
    return false;
  }

  var savedK = 0, count = 0;
  for (var i = 0; i < first.length; i++) {
    for (var k = savedK; k < second.length; k++) {

      var firstObject = typeof first[i] === 'object' ? JSON.stringify(first[i]) : first[i];
      var secondObject = typeof second[k] === 'object' ? JSON.stringify(second[k]) : second[k];
      if (firstObject === secondObject) {
        savedK = k + 1;
        count += 1;
        break;
      } else {
        count = 0;
      }
    }
  }
  return count === first.length;
}
