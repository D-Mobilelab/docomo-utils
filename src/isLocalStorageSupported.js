/**
 * Check if local storage is supported
 * @returns {Boolean}
 */
export default function isLocalStorageSupported() {
  try {
    const privateBrowsingKey = 'navigationModeSupportsLocalStorage';
    localStorage.setItem(privateBrowsingKey, 0);
    localStorage.removeItem(privateBrowsingKey);
    return true;
  } catch (err) {
    return false;
  }
}
