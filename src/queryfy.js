import dequeryfy from './dequeryfy';
import merge from './merge';
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
export default function queryfy(_api, query) {
  const previousQuery = dequeryfy(_api);
  let qs = '';
  let finalQuery;
  let api = _api.slice(0);

  if (api.indexOf('?') > -1) {
    api = api.slice(0, api.indexOf('?'));
  }

  api += '?';
  finalQuery = merge(previousQuery, query);

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
