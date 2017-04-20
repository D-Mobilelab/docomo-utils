/**
 * getType
 * @returns {string} the type of the object. date for date array etc
 */
export default function getType(obj) {
  return ({}).toString.call(obj).match(/\s([a-z|A-Z]+)/)[1].toLowerCase();
}
