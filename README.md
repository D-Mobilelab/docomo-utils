### docomo-utils.js

A set of utilities function for docomo products. 
Exports as Javascript Universal Module Definition (UMD)

## Import in html

```javascript
// Specific range version
<script src="https://unpkg.com/docomo-utils@^0.4.0/dist/docomo-utils.min.js"></script>
//Last version
<script src="https://unpkg.com/docomo-utils/dist/docomo-utils.min.js"></script>
<script type="text/javascript">
    var settings = window.docomoUtils.merge({a:1}, {b:2}); // => { a:1, b:2 }
</script>
```

## Import in CommonJS style

npm install docomot-utils

```javascript
import docomoUtils from 'docomo-utils';
//OR
import { queryfy, dequeryfy, merge, JSONPRequest } from 'docomo-utils';
```

# API

## Iterator

Iterator

**Parameters**

-   `array` **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)** the array you want to transform in iterator

**Examples**

```javascript
var myArray = ["pippo", "pluto", "paperino"];
var it = Iterator(myArray);
it.next().value === "pippo"; //true
it.next().value === "pluto"; //true
it.next(true).value === "paperino" //false because with true you can reset it!
```

Returns **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** an iterator-like object

## extend

extend: this function merge two objects in a new one with the properties of both

**Parameters**

-   `o1` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** \-
-   `o2` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** \-

Returns **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** a brand new object results of the merging

## dequeryfy

A function to dequerify query string

**Parameters**

-   `_url` **Strinq** 

**Examples**

```javascript
var url = "http://jsonplaceholder.typicode.com/comments?postId=1
var obj = dequerify(url); //obj is {"postId":"1"}
```

Returns **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** the object with key-value pairs, empty if no querystring is present

## queryfy

A function to compose query string

**Parameters**

-   `_api` **Strinq** the endpoint
-   `query` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** a key value object: will be append to <api>?key=value&key2=value2

**Examples**

```javascript
var API = "http://jsonplaceholder.typicode.com/comments"
var url = queryfy(API, {postId:1});
// url will be "http://jsonplaceholder.typicode.com/comments?postId=1"
```

Returns **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** the string composed

## merge

Merge n objects

**Parameters**

-   `N` **...[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** object to merge together

Returns **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 

## memoize

Simple memoization function

**Parameters**

-   `fn` **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** 

Returns **any** what the real function returns

## getType

getType

**Parameters**

-   `obj`  

Returns **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** the type of the object. date for date array etc

## JSONPRequest

Make a jsonp request, remember only GET
The function create a tag script and append a callback param in querystring.
The promise will be reject after 3s if the url fail to respond

**Parameters**

-   `url` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** the url with querystring but without &callback at the end or &function
-   `timeout` **\[[Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)](default 3000)** ms range for the response

**Examples**

```javascript
<pre>
request = new JSONPRequest("http://www.someapi.com/asd?somequery=1");
request.then((data) => {});
</pre>
```

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;([Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) \| [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String))>** 

## debounce

Debounce. Wait ms to execute a function

**Parameters**

-   `fn` **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** the function to be wrapped
-   `ms` **\[[Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)]** the number of ms to wait (optional, default `300`)
-   `immediate` **[Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** execute immediate and wait ms. If false only the last call

Returns **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** returns the function decorated

## throttle

Throttle. Useful for resize event or scroll

**Parameters**

-   `fn` **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** the function to be wrapped
-   `limit` **\[[Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)]** only x call for ms (optional, default `300`)

Returns **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** returns the function decorated

## arrayContains

Returns true if the first array is
contained in the second one.

**Parameters**

-   `first` **([Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) \| [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String))** 
-   `second` **([Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) \| [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String))** 

**Examples**

```javascript
arrayContains([1,2,3] [4,5,6,1,2,3]) // true
Works even with array of objects and string
```

Returns **[Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** 

## isLocalStorageSupported

Check if local storage is supported

Returns **[Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** 

## addEvent

Cross browsing addEvent

**Parameters**

-   `event` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** the event name
-   `element` **[HTMLElement](https://developer.mozilla.org/en-US/docs/Web/HTML/Element)** HTMLElement
-   `callback` **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** \-

Returns **[HTMLElement](https://developer.mozilla.org/en-US/docs/Web/HTML/Element)** 

## checkObject

Check if the object has the nested keys list

**Parameters**

-   `keys` **([Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) \| [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String))** a string with point separator or a list of string keys
-   `object` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** the object to be checked
-   `defaultReturn` **\[any]**  (optional, default `null`)

**Examples**

```javascript
checkObject(["a", "b", 2], {a:{b:[1,2,3]}})); // returns 3
checkObject("a.b.0", {a:{b:[1,2,3]}})); // returns the b[0]
```

Returns **(any | null)** returns any value for that key or null if the key is undefined
