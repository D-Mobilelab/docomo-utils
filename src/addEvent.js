/**
 * Cross browsing addEvent
 *
 * @param {String} event - the event name
 * @param {HTMLElement} element - HTMLElement
 * @param {Function} callback -
 * @returns {HTMLElement}
 */
export default function addEvent(event, element, callback) {
  if (typeof element.addEventListener !== 'undefined') {
    element.addEventListener(event, callback, false);
  } else if (typeof element.attachEvent !== 'undefined') {
    element.attachEvent('on' + event, callback);
  }	else {
    element['on' + event] = callback;
  }
  return element;
}
