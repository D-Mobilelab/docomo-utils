/**
 * A function to dequerify query string
 *
 * @example
 * var url = "http://jsonplaceholder.typicode.com/comments?postId=1"
 * var obj = dequeryfy(url); //obj is {"postId":"1"}
 * @param {Strinq} _url
 * @returns {Object} the object with key-value pairs, empty if no querystring is present
 * */
export default function dequeryfy(_url) {
  const param = decodeURI(_url.slice(0));

  const query = param.split('?')[1];
  if (!query) { return {}; }

  const keyvalue = query.split('&');

  return keyvalue.reduce((newObj, _keyvalue) => {
    const splitted = _keyvalue.split('=');
    const key = decodeURIComponent(splitted[0]);
    const value = decodeURIComponent(splitted[1]);
    newObj[key] = value;
    return newObj;
  }, {});
}
