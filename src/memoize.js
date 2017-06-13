/**
 * Simple memoization function.
 * A memoizated function cache the results of a function
 * computation when it receives the same params
 * @export
 * @param {Function} fn - the function to memoize
 * @param {Function} deps - should returns an array with dependencies
 * @param {Object} [scope=this] - the this object. default to this-generated function
 * @returns {any} what the real function returns
 * @example
 *    function Person(){
        this.name = 'aldo';
        this.surname = 'baglio';
      };

      Person.prototype.getFullName = function(title) {
        var _title = title ? title : '';
        return _title + this.name + ' ' + this.surname;
      };

      var person = new Person();
      //remember to bind it
      var memoized = memoize(person.getFullName, function(){ return [this.name, this.surname];}.bind(person), person);
 */
export default function memoize(fn, deps, scope) {
  const cache = {};
  return function memoized() {
    const context = scope || this;
    const args = [].slice.call(arguments);
    // more perfomant than push
    if (deps) { args[args.length] = deps(); }
    const key = JSON.stringify(args);
    if (key in cache) {
      return cache[key];
    }
    cache[key] = fn.apply(context, arguments);
    return cache[key];
  };
}
