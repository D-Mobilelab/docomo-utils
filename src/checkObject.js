/**
 * Check if the object has the nested keys list
 * @example
 * checkObject({a:{b:[1,2,3]}}, ["a", "b", 2])); // returns 3
 * checkObject({a:{b:[1,2,3]}}),"a.b.0"); // returns the b[0]
 * @export
 * @param {Object} object - the object to be checked
 * @param {Array|String} keys - a string point separated or a list of string keys
 * @param {any} [defaultReturn=null]
 * @returns {any|null} returns any value for that key or null if the key is undefined
 */
export default function checkObject(object, keys, defaultReturn = null) {
  let _keys;
  if (typeof keys === 'string') {
    _keys = keys.split('.');
  } else if (Array.isArray(keys)) {
    _keys = keys;
  } else {
    return defaultReturn;
  }
  return _keys.reduce((obj, key) => (obj && obj[key]) ? obj[key] : defaultReturn, object);
}
