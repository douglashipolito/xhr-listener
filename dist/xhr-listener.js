/*
*
* Polyfills for Browsers
*
*/
/*jshint unused: false*/
(function (window) {
  "use strict";

  /*
   * Array.prototype.forEach
   */

  // Production steps of ECMA-262, Edition 5, 15.4.4.18
  // Reference: http://es5.github.com/#x15.4.4.18
  if (!Array.prototype.forEach) {

    Array.prototype.forEach = function (callback, thisArg) {
      var T, k;

      if (this === null) {
        throw new TypeError(" this is null or not defined");
      }

      // 1. Let O be the result of calling ToObject passing the |this| value as the argument.
      var O = Object(this);

      // 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
      // 3. Let len be ToUint32(lenValue).
      var len = O.length >>> 0;

      // 4. If IsCallable(callback) is false, throw a TypeError exception.
      // See: http://es5.github.com/#x9.11
      if (typeof callback !== "function") {
        throw new TypeError(callback + " is not a function");
      }

      // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
      if (arguments.length > 1) {
        T = thisArg;
      }

      // 6. Let k be 0
      k = 0;

      // 7. Repeat, while k < len
      while (k < len) {

        var kValue;

        // a. Let Pk be ToString(k).
        //   This is implicit for LHS operands of the in operator
        // b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
        //   This step can be combined with c
        // c. If kPresent is true, then
        if (k in O) {

          // i. Let kValue be the result of calling the Get internal method of O with argument Pk.
          kValue = O[k];

          // ii. Call the Call internal method of callback with T as the this value and
          // argument list containing kValue, k, and O.
          callback.call(T, kValue, k, O);
        }
        // d. Increase k by 1.
        k++;
      }
      // 8. return undefined
    };
  }

  /*
   * Object.create
   */

  if (typeof Object.create != 'function') {
    (function () {
        var F = function () {};
        Object.create = function (o) {
            if (arguments.length > 1) {
              throw new Error('Second argument not supported');
            }
            if (o === null) {
              throw new Error('Cannot set a null [[Prototype]]');
            }
            if (typeof o != 'object') {
              throw new TypeError('Argument must be an object');
            }
            F.prototype = o;
            return new F();
        };
    })();
  }
}(window));


/*
 *
 * XHR Listener Lib
 *
 */
(function(global, undefined) {

  "use strict";


var XHR = (function(){
      var proto = global.XMLHttpRequest.prototype,
          methods = ['open', 'send'],
          originalXHR = {};

      originalXHR.proto = proto;

      if(!methods.length) {
        methods.push('open');
      }

      methods.forEach(function (method) {
        originalXHR[method] = proto[method];
      });

      return originalXHR;
    }()),

    requests = {};

/**
 * @constructor
 * @public
 *
 * @description
 * If there is a callback, it will automatically call
 * the 'done' callback
 *
 * @param {String} path - Path that must be tracked
 * @param {String} [callback] - Done Callback to that path
 *
 */
function XhrListener(path, callback) {
  if(!(this instanceof XhrListener)) {
    var o = Object.create(XhrListener.prototype);
    o.constructor.apply(o, arguments);
    return o;
  }

  this.path = path;

  if(callback) {
    this.done(path, callback);
  }
}

/**
 * @public
 *
 * @description
 * Prototype class of xhrListener.
 * It has all methods that can be accessed through XhrListenerInstance.[method]
 *
 */
XhrListener.prototype = {
  constructor: XhrListener,

 /**
 * @public
 *
 * @description
 * This method will be called when some xhr connection is open
 *
 * @param {String} path - Path that must be tracked
 * @param {String} [callback] - OnOpen Callback to that path
 */
  onopen: function (path, callback) {
    addRequest.call(this, 'onopen', path, callback);
  },

/**
 * @public
 *
 * @description
 * This method will be called when some xhr connection is done
 *
 * @param {String} path - Path that must be tracked
 * @param {String} [callback] - Done Callback to that path
 */
  done: function (path, callback) {
    addRequest.call(this, 'done', path, callback);
  },

/**
 * @public
 *
 * @description
 * This method is called when some error occurs
 *
 * @param {String} path - Path that must be tracked
 * @param {String} [callback] - Done Callback to that path
 */
  error: function (path, callback) {
    addRequest.call(this, 'error', path, callback);
  }
};

/**
 * @public
 *
 * @description
 * Gets all tracked requests
 *
 * @return {Object} - Requests' object
 */
XhrListener.getRequestsList = function () {
  return requests;
};

/**
 * @private
 *
 * @description
 * Adds a new request.
 * It will insert a new object into 'requests' containing its
 * path, callback, and type
 *
 * @param {String} type - Type of this request, done, error, onopen..
 * @param {String|Function} [path] - This param is optional unless there is no path defined yet
 * @param {Function} callback - The callback to this request
 *
 */
function addRequest() {
  var args = getArguments(arguments),
      type = args[0],
      path = args[1],
      callback = args[2],
      objectRequest = {};

  //The type param must be a string
  if(!type || typeof type === 'function') {
    console.error('the type of request must be a string');
    return false;
  }

  //The 'path' param might be a function unless the
  //'path' param has already been defined in the
  //current xhrListener's instance
  if(typeof path === 'function') {
    if(typeof this.path === 'undefined') {
      console.error('please define a path to track');
      return false;
    }

    //There is 'path' param in the current xhrListener's instance
    callback = path;
    path = this.path;
  } else {
    //There is no 'path' param, creates a new one
    this.path = path;
  }

  //The 'path' is required, it must be defined
  if(typeof this.path !== 'string' && !(this.path instanceof RegExp)) {
    console.error('there is no path to track');
    return false;
  }

  //Creates a new object request
  objectRequest[path] = requests[path] || {};
  objectRequest[path].path = path;
  objectRequest[path][type] = objectRequest[path][type] || [];
  objectRequest[path][type].push(callback);

  //Attaches this object to the requests object
  requests[path] = objectRequest[path];
}

/**
 * @public
 *
 * @description
 * The Open's replaces
 *
 * @param {String} method - The method of this request
 * @param {String} url - The url of this request
 *
 * @return {Object} - An xhr open instance
 */
XHR.proto.open = function (method, url) {
  var _xhr = this, //Save a reference to xhr
      args = arguments, //All arguments

      //The original handlers, it means the callback of
      //xhr.onload or xhr.onreadystatechange
      //that the user has defined
      originalHandlers = {
        onreadystatechange: false
      };

  //Saves a reference to url
  _xhr.url = url;

  //If this request doesn't have this url
  //Don't do anything with this request
  if(!requestFound(_xhr.url)) {
    return XHR.open.apply(this, arguments);
  }

  //Gets url params
  _xhr.params =  {
    get: getUrlParams(url),
    post: {}
  };

  //The xhr method
  _xhr.method = method.toLowerCase();

  //The handler onreadystatechange has already been defined
  if(_xhr.onreadystatechange) {
    originalHandlers.onreadystatechange = _xhr.onreadystatechange;
  }

  //On ready state change handler
  _xhr.onreadystatechange = function () {
    readyStateChangeHandler.apply(this, arguments);

    //If the user has changed the onreadystatechange, call it
    if(originalHandlers.onreadystatechange) {
      originalHandlers.onreadystatechange.apply(this, arguments);
    }
  };

  //Observes the changes on onreadystatechange
  observePropertyChange.call(_xhr, 'onreadystatechange', function (fn) {
    originalHandlers.onreadystatechange = fn;
  });

  //Through each request found, call the onopen callback if it exists
  eachRequestFound(function(path, request) {
    if(request.onopen) {
      request.onopen.forEach(function (onopen) {
        onopen.apply(_xhr, args);
      });
    }
  }, url);

  return XHR.open.apply(this, arguments);
};

/**
 * @public
 *
 * @description
 * The Send's replaces
 *
 * @return {Object} - An xhr send instance
 */
XHR.proto.send = function (params) {
  var _xhr = this;

  if(!requestFound(_xhr.url)) {
    return XHR.send.apply(_xhr, arguments);
  }

  _xhr.params.post = params ? getUrlParams(params) : '';
  return XHR.send.apply(_xhr, arguments);
};

/**
 * @private
 *
 * @description
 * Handler to onload request
 *
 */
function onloadHandler() {
  var ready = this,
      args = arguments;

  eachRequestFound(function(path, request) {

    //The request is ok and there is an done callback
    if(request.done && ready.status === 200) {
      var type = getType(ready.getResponseHeader('Content-Type'));

      //Defines a object containing the type of this request
      ready.is = isType(type);

      //Calls each on 'done' callback
      //This loop is necessary because we can define more than one
      //callback for the same path, like using a global
      //path '/.*/' for every request
      request.done.forEach(function (done) {
        done.call(ready, ready.responseText, ready.response, type);

        //Sets a new responseText if it exists
        if(ready.newResponseText) {
          defineNewResponse.call(ready, 'responseText');
        }

        //Sets a new response if it exists
        if(ready.newResponse) {
          defineNewResponse.call(ready, 'response');
        }
      });
    }

    //There are errors and ready.status is different than 200,
    //call error callback
    else if(request.error && ready.status !== 200) {
      request.error.forEach(function (error) {
        error.call(ready, ready.status, ready.statusText);
      });
    }
  }, ready.url);
}

/**
 * @private
 *
 * @description
 * Handler to ready state change
 *
 */
function readyStateChangeHandler() {
  var ready = this;

  if(ready.readyState === 4) {
    onloadHandler.apply(ready, arguments);
  }
}

/**
 * @private
 *
 * @description
 * Call eachRequestFound with the url param
 *
 * @param {String} url - url to test
 *
 */
function requestFound(url) {
  return eachRequestFound(false, url);
}

/**
 * @private
 *
 * @description
 * Matches the url param with tracked urls
 *
 * @param {Function} callback - Callback to request found
 * @param {String} url - Url that needs to be compared with tracked urls
 */
function eachRequestFound(callback, url) {
  var found = false;

  eachRequest(function(request) {
    if(matchPath(request.path, url)) {
      if(callback) {
        callback(request.path, request);
      }

      found = true;
    }
  });

  return found;
}

/**
 * @private
 *
 * @description
 * Call the callback for each requests
 *
 * @param {Function} callback - Callback to request found
 *
 */
function eachRequest(callback) {
  var key;

  for(key in requests) {
    callback(requests[key]);
  }
}

/**
 * @private
 *
 * @description
 * Matches the path param with the tracked url
 *
 * @param {String} path - Original url of request
 * @param {String} url - Url that must be tracked
 *
 */
function matchPath(path, url) {
  return typeof path !== 'string' ? path.test(url) : path === url;
}

/**
 * @private
 *
 * @description
 * Simples alias for Array.prototype.slice.call
 *
 * @param {ArrayLike} args - Array-Like of Arguments
 *
 */
function getArguments(args) {
  return Array.prototype.slice.call(args);
}

/**
 * @private
 *
 * @description
 * Allows to replace the 'response' property for a new value
 *
 * @param {String} responseType - The type of response, it should be 'responseText' or 'response'
 *
 */
function defineNewResponse(responseType) {
  var property = responseType,
      newProperty = 'new' + property[0].toUpperCase() + property.slice(1),
      val = this[property];

  Object.defineProperty(this, property, {
    get: function() {
      return val;
    },

    set: function() {
      val = this[newProperty];
      return val;
    },

    configurable: true
  });

  this[property] = this[newProperty];
}

/**
 * @private
 *
 * @description
 * Observer for property change, when something is changed on object,
 * the callback is called
 *
 * @param {String} property - Property that has to be observed
 * @param {Function} callback - Callback to this observer
 *
 */
function observePropertyChange(property, callback) {
  var val = this[property];

  if(Object.getOwnPropertyDescriptor(this, property).configurable) {
    Object.defineProperty(this, property, {
      get: function() {
        return val;
      },

      set: function(newVal) {
        val = newVal;
        callback.call(this, val);
        return val;
      },

      configurable: true
    });
  }
}

/**
 * @private
 *
 * @description
 * Matches the type of request
 *
 * @param {String} type - Content type of request
 * @returns {String} - Content type of request
 */
function getType(type) {
  if (type.match('json')) {
    return 'json';
  }

  if (type.match('javascript')) {
    return 'js';
  }

  if (type.match('text')) {
    return 'html';
  }

  if (type.match('xml')) {
    return 'xml';
  }

  return 'text';
}

/**
 * @private
 *
 * @description
 * Matches type of request
 *
 * @param {String} type - Type of request
 *
 * @return {Object} - Object containing the types and if it matches with the type param
 */
function isType(type) {
  return {
    html: type === 'html',
    json: type === 'json',
    js: type === 'js',
    text: type === 'text'
  };
}

/**
 * @private
 *
 * @description
 * Gets the url params
 *
 * @param {String} url - Url of request
 *
 * @return {Object} - Object containing the params
 */
function getUrlParams(url) {
  var params = {},
      hasParams = false;

  url.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (match, key, value) {
    params[key] = value;
    hasParams = true;
  });

  return hasParams ? params : '';
}

//Version.
XhrListener.VERSION = '0.0.1';

//Export to the global
global.XhrListener = XhrListener;


}(this));
