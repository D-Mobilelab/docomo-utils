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
export function Iterator(array) {
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

/**
 * extend: this function merge two objects in a new one with the properties of both
 *
 * @param {Object} o1 -
 * @param {Object} o2 -
 * @returns {Object} a brand new object results of the merging
 * */
export function extend(o1, o2) {
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

/**
 * A function to dequerify query string
 *
 * @example
 * var url = "http://jsonplaceholder.typicode.com/comments?postId=1
 * var obj = dequerify(url); //obj is {"postId":"1"}
 * @param {Strinq} _url
 * @returns {Object} the object with key-value pairs, empty if no querystring is present
 * */
export function dequeryfy(_url) {
  var param = decodeURI(_url.slice(0));

  var query = param.split('?')[1];
  if (!query) { return {}; }

  var keyvalue = query.split('&');

  return keyvalue.reduce((newObj, _keyvalue) => {
    const splitted = _keyvalue.split('=');
    const key = decodeURIComponent(splitted[0]);
    const value = decodeURIComponent(splitted[1]);
    newObj[key] = value;
    return newObj;
  }, {});
}

/**
 * A function to compose query string
 *
 * @example
 * var API = "http://jsonplaceholder.typicode.com/comments"
 * var url = queryfy(API, {postId:1});
 * // url will be "http://jsonplaceholder.typicode.com/comments?postId=1"
 * @param {Strinq} _api - the endpoint
 * @param {Object} query - a key value object: will be append to <api>?key=value&key2=value2
 * @returns {String} the string composed
 * */
export function queryfy(_api, query) {
  const previousQuery = dequeryfy(_api);
  let qs = '';
  let finalQuery;
  let api = _api.slice(0);

  if (api.indexOf('?') > -1) {
    api = api.slice(0, api.indexOf('?'));
  }

  api += '?';
  finalQuery = extend(previousQuery, query);

  for (const key in finalQuery) {
    if (finalQuery.hasOwnProperty(key)) {
      qs += encodeURIComponent(key);
      // if a value is null or undefined keep the key without value
      if (finalQuery[key]) { qs += '=' + encodeURIComponent(finalQuery[key]); }
      qs += '&';
    }
  }

  if (qs.length > 0) {
    qs = qs.substring(0, qs.length - 1); // chop off last
  }
  return [api, qs].join('');
}

/**
 * Merge n objects
 * @param {...Object} N object to merge together
 * @returns {Object}
 */
export function merge() {
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

/**
 * Simple memoization function
 * @export
 * @param {Function} fn
 * @returns {any} what the real function returns
 */
export function memoize(fn) {
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

/**
 * getType
 * @returns {string} the type of the object. date for date array etc
 */
export function getType(obj) {
  return ({}).toString.call(obj).match(/\s([a-z|A-Z]+)/)[1].toLowerCase();
}

/**
 * Make a jsonp request, remember only GET
 * The function create a tag script and append a callback param in querystring.
 * The promise will be reject after 3s if the url fail to respond
 *
 * @example
 * <pre>
 * request = new JSONPRequest("http://www.someapi.com/asd?somequery=1");
 * request.then((data) => {});
 * </pre>
 * @param {String} url - the url with querystring but without &callback at the end or &function
 * @param {Number} timeout - ms range for the response
 * @return {Promise<Object|String>}
 * */
export function JSONPRequest(url, timeout = 3000) {
  const self = this;
  self.timeout = timeout;
  self.called = false;
  if (window.document) {
    const ts = Date.now();
    self.scriptTag = window.document.createElement('script');
        // url += '&callback=window.__jsonpHandler_' + ts;
    let _url = '';
    if (url && url !== '') {
      _url = queryfy(url, { callback: `window.__jsonpHandler_${ts}` });
    }

    self.scriptTag.src = _url;
    self.scriptTag.type = 'text/javascript';
    self.scriptTag.async = true;

    self.prom = new Promise((resolve, reject) => {
      const functionName = `__jsonpHandler_${ts}`;
      window[functionName] = function handler(data) {
        self.called = true;
        resolve(data);
        self.scriptTag.parentElement.removeChild(self.scriptTag);
        delete window[functionName];
      };
      // reject after a timeout
      setTimeout(() => {
        if (!self.called) {
          reject(`Timeout jsonp request ${ts}, ${_url}`);
          self.scriptTag.parentElement.removeChild(self.scriptTag);
          delete window[functionName];
        }
      }, self.timeout);
    });
    // the append start the call
    window.document.getElementsByTagName('head')[0].appendChild(self.scriptTag);
  }
}

/**
 * Debounce. Wait ms to execute a function
 * @param {Function} fn - the function to be wrapped
 * @param {Number} [ms = 300] - the number of ms to wait
 * @param {Boolean} immediate - execute immediate and wait ms. If false only the last call
 * @returns {Function} returns the function decorated
 */
export function debounce(fn, ms = 300, immediate) {
  var timeoutID;
  var theFn;
  return function () {
    var context = this, args = [].slice.call(arguments);
    theFn = function () {
     timeoutID = null;
     if (!immediate) return fn.apply(context, args);
   };
    var callNow = immediate && !timeoutID;
    clearTimeout(timeoutID);
    timeoutID = setTimeout(theFn, ms);
    if (callNow) return fn.apply(context, args);
  };
}

/**
 * Throttle. Useful for resize event or scroll
 * @param {Function} fn - the function to be wrapped
 * @param {Number} [limit=300] - only x call for ms
 * @returns {Function} returns the function decorated
 */
export function throttle(fn, limit = 300) {
  var wait = false;
  return function () {
    var context = this, args = [].slice.call(arguments);
    if (!wait) {
      var toReturn = fn.apply(context, args);
      wait = true;
      setTimeout(function () {
        wait = false;
      }, limit);
      return toReturn;
    }
  };
}

/**
 * Returns true if the first array is
 * contained in the second one.
 * @example arrayContains([1,2,3] [4,5,6,1,2,3]) // true
 * Works even with array of objects and string
 * @param {Array|String} first
 * @param {Array|String} second
 * @returns {Boolean}
 */
export function arrayContains(first, second) {
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

/**
 * Check if local storage is supported
 * @returns {Boolean}
 */
export function isLocalStorageSupported() {  
  try {
    const privateBrowsingKey = 'navigationModeSupportsLocalStorage';
    root.localStorage.setItem(privateBrowsingKey, 0);
    root.localStorage.removeItem(privateBrowsingKey);
    return true;
  } catch (err) {
    return false;
  }
}

/**
 * Cross browsing addEvent
 *
 * @param {String} event - the event name
 * @param {HTMLElement} element - HTMLElement
 * @param {Function} callback -
 * @returns {HTMLElement}
 */
export function addEvent(event, element, callback) {
  if (typeof element.addEventListener !== 'undefined') {
    element.addEventListener(event, callback, false);
  } else if (typeof element.attachEvent !== 'undefined') {
    element.attachEvent('on' + event, callback);
  }	else {
    element['on' + event] = callback;
  }
  return element;
}

/**
 * Check if the object has the nested keys list
 * @example
 * checkObject(["a", "b", 2], {a:{b:[1,2,3]}})); // returns 3
 * checkObject("a.b.0", {a:{b:[1,2,3]}})); // returns the b[0]
 * @export
 * @param {Array|String} keys - a string with point separator or a list of string keys
 * @param {Object} object - the object to be checked
 * @param {any} [defaultReturn=null]
 * @returns {any|null} returns any value for that key or null if the key is undefined
 */
export function checkObject(keys, object, defaultReturn = null) {
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

export default {
  Iterator,
  debounce,
  throttle,
  JSONPRequest,
  getType,
  memoize,
  merge,
  extend,
  queryfy,
  dequeryfy,
  addEvent,
  isLocalStorageSupported,
  checkObject,
};
