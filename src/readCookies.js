/**
 * Read the cookies in document.cookie string
 * @param {string} cookies - the document.cookie string in this format key=val;
 * @returns {object} the cookies as object key value pairs
 */
export default function readCookies(cookies) {
  const strippedCookies = cookies.replace(/\s/g,'');
  return strippedCookies.split(';').reduce((prev, current) => {
    const [key, val] = current.split('=');
    prev[key] = val;
    return prev;
  }, {});
}
