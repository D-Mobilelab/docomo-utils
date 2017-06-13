import queryfy from './queryfy';
/**
 * Make a jsonp request, remember only GET
 * The function create a tag script and append a callback param in querystring.
 * The promise will be reject after 3s if the url fail to respond
 *
 * @example
 * const request = new JSONPRequest("http://www.someapi.com/asd?somequery=1");
 * request.promise.then((data) => {});
 * request.prom.then((data) => {});
 * @param {String} url - the url with querystring but without &callback at the end or &function
 * @param {Number} timeout - ms range for the response
 * @return {Promise<Object|String>}
 * */
export default function JSONPRequest(url, timeout = 3000) {
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
    const promise = new Promise((resolve, reject) => {
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
    self.prom = promise;
    self.promise = promise;
    // the append start the call
    window.document.getElementsByTagName('head')[0].appendChild(self.scriptTag);
  }
}
