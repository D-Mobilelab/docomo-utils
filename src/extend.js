/**
 * extend: this function merge two objects in a new one with the properties of both
 *
 * @param {Object} o1 -
 * @param {Object} o2 -
 * @returns {Object} a brand new object results of the merging
 * */
export default function extend(o1, o2) {
  const isObject = Object.prototype.toString.apply({});
  const newObject = {};
  if ((o1.toString() !== isObject) || (o2.toString() !== isObject)) {
    throw new Error('Cannot merge different type');
  }
  for (const k in o1) {
    if (o1.hasOwnProperty(k)) {
      newObject[k] = o1[k];
    }
  }

  for (const j in o2) {
    if (o2.hasOwnProperty(j)) {
      if (Array.isArray(o1[j]) && Array.isArray(o2[j])) {
        newObject[j] = o1[j].concat(o2[j]);
        continue;
      }
      newObject[j] = o2[j];
    }
  }
  return newObject;
}
