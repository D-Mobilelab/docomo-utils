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
    next: (reset) => {
      if (reset) { nextIndex = 0; }
      return nextIndex < array.length ?
          { value: array[nextIndex++], done: false } :
          { done: true };
    }
  };
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
    var splitted = _keyvalue.split('=');
    var key = decodeURIComponent(splitted[0]);
    var value = decodeURIComponent(splitted[1]);
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
 * @param {Strinq} _api
 * @param {Object} params - a key value object: will be append to <api>?key=value&key2=value2
 * @returns {String} the string composed
 * */
export function queryfy(_api, query) {
  var previousQuery = dequeryfy(_api);
  var qs = '',
    finalQuery,
    api = _api.slice(0);

  if (api.indexOf('?') > -1) {
    api = api.slice(0, api.indexOf('?'));
  }

  api += '?';
  finalQuery = extend(previousQuery, query);

  for (var key in finalQuery) {
    qs += encodeURIComponent(key);
    // if a value is null or undefined keep the key without value
    if (finalQuery[key]) { qs += '=' + encodeURIComponent(finalQuery[key]); }
    qs += '&';
  }

  if (qs.length > 0) {
    qs = qs.substring(0, qs.length - 1); // chop off last
  }
  return [api, qs].join('');
}

/**
 * extend: this function merge two objects in a new one with the properties of both
 *
 * @param {Object} o1 -
 * @param {Object} o2 -
 * @returns {Object} a brand new object results of the merging
 * */
export function extend(o1, o2) {

  var isObject = Object.prototype.toString.apply({});
  if ((o1.toString() !== isObject) || (o2.toString() !== isObject)) {
    throw new Error('Cannot merge different type');
  }
  var newObject = {};
  for (var k in o1) {
    if (o1.hasOwnProperty(k)) {
        newObject[k] = o1[k];
      }
  }

  for (var j in o2) {
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
 * Merge n objects
 * @param {...Object} N object to merge together
 * @returns {Object}
 */
export function merge() {
  const temp = {};
  let objects = [].slice.call(arguments);
  for (let i = 0; i < objects.length; i++) {
    for (let key in objects[i]) {
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
    return cache[key] = fn.apply(this, arguments);
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
      let functionName = `__jsonpHandler_${ts}`;
      window[functionName] = function (data) {
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
