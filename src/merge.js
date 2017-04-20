/**
 * Merge n objects
 * @param {...Object} N object to merge together
 * @returns {Object}
 */
export default function merge() {
  const temp = {};
  const objects = [].slice.call(arguments);
  for (let i = 0; i < objects.length; i++) {
    for (const key in objects[i]) {
      if (objects[i].hasOwnProperty(key)) {
        temp[key] = objects[i][key];
      }
    }
  }
  return temp;
}
