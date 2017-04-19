import {
  queryfy,
  dequeryfy,
  extend,
  merge,
  arrayContains,
  debounce,
  checkObject,
} from '../main';

describe('Utils tests', function() {

    beforeEach(() => {

    });

    afterEach(() => {

    });

    it('Queryfy: should encode correctly', function() {
        var result = queryfy('', { a: 'b b', 'c': 'a' });
        expect(result).toBe('?a=b%20b&c=a');
    });

    it('Queryfy: should work with a key with null value', function() {
        var result = queryfy('', { a: 'b b', 'c': null });
        expect(result).toBe('?a=b%20b&c');
    });

    it('Queryfy: should add other query params if already have keys', function(){
        var result = queryfy('http://pippo.com/?comment=1&c=2', { a: 2, c: null });
        result = result.slice(result.indexOf('?') + 1, result.length).split('&');

        expect(result.indexOf('comment=1') > -1).toEqual(true);
        expect(result.indexOf('a=2') > -1).toEqual(true);
        expect(result.indexOf('c') > -1).toEqual(true);
        expect(result.indexOf('c=2') > -1).toEqual(false);
    });

    it('Dequeryfy: should decode correct', function(){
        var result = dequeryfy('?a=b%20b&c=a');
        expect(result).toEqual({ a: 'b b', 'c': 'a' });
    });

    it('Dequeryfy: should handle empty string', function(){
        var result = dequeryfy('');
        expect(result).toEqual({});
    });

    it('Dequeryfy: should handle string without querystring', function(){
        var result = dequeryfy('http://pippo.com');
        expect(result).toEqual({});
    });

    it('Queryfy: with a key with undefined value', function(){
        var result = queryfy('', { a: 'b b', 'c': undefined });
        expect(result).toBe('?a=b%20b&c');
    });

    it('Queryfy: should not modify params passed by reference', function() {
        var api = 'http://pippo.com/';
        var result = queryfy(api, { a: 'b b', 'c': 5 });
        expect(result).toBe('http://pippo.com/?a=b%20b&c=5');
        expect(api).toEqual('http://pippo.com/');
    });

    it('Extend: should now merge two objects with different type', function(){
        var override = extend({ aa: 1 }, { aa: 2 });
        var ovverrideAndExtend = extend({ aa: 1 }, { aa: 2, bb: 'c' });

        //
        expect(override).toEqual({ aa: 2 });
        expect(ovverrideAndExtend).toEqual({ aa: 2, bb: 'c' });
        expect(function(){
            var diffenrentType = extend({ aa: 1 }, new Date);
        }).toThrow(new Error('Cannot merge different type'));
    });

    it('Merge: should merge and ovewrite', function(){
        var merged = merge({ a: 1, b: 2, c: 3 }, { c: 4 });
    });

    it('Merge: should merge with empty object', function(){
        var merged = merge({ a: 1, b: 2, c: 3 }, {});
        expect(merged).toEqual({ a: 1, b: 2, c: 3 });
    });

    it('Array contains: should contain the subset', function(){
      var a = [6, 8, 5];
      var b = [3, 4, 5, 6, 8, 5, 6,8];

      expect(arrayContains(a, b)).toEqual(true);
    });

    it('Array contains: false if it is not contained', function(){
      var a = [6, 8, 6];
      var b = [3, 4, 5, 6, 8, 5, 6, 8];

      expect(arrayContains(a, b)).toEqual(false);
    });

    it('Array contains: should work with strings(they are iterable)', function(){
      expect(arrayContains("asd", "asdfgh")).toEqual(true);
    });

    it('Array contains: should work with array of objects too', function(){
      expect(arrayContains([{a:1}, {a:2}, [1]], [{a:1}, {a:2}, [1], {a:3}])).toEqual(true);
    });

    it('Array contains: should returns false', function(){
      expect(arrayContains([ 1, 2 ], [1])).toEqual(false);
    });

    it('Debounce: should take only last call in ms', function(done){
      var aSpy = jasmine.createSpy('spy');
      function add(a, b, callback) {
        aSpy(a, b, callback);
        return callback ? callback(a + b) : a + b;
      }
      var debounced = debounce(add, 100);
      for(var i = 0; i < 10000; i++) {
        debounced(2, 2);
      }

      setTimeout(function(){
        expect(aSpy.calls.count()).toEqual(1);
        done();
      }, 110);
    });

    it('Debounce: should be called only two times because called with leading true', function (done) {
      var aSpy = jasmine.createSpy('spy');
      function add(a, b, callback) {
        aSpy(a, b, callback);
        return callback ? callback(a + b) : a + b;
      }
      var debounced = debounce(add, 100, true);
      debounced(2, 2);
      setTimeout(function(){
        debounced(5, 2);
      }, 110);


      setTimeout(function(){
        expect(aSpy.calls.count()).toEqual(2);
        done();
      }, 115);
    });

    it('checkObject: should return null if key not exist', function () {
      var objTocheck = {a:{b:{c:{d:1}}}};
      expect(checkObject('a.b.c.d', objTocheck)).toEqual(1);
    });
});
