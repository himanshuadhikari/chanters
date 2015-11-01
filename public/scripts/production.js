/**
 * @license ChantersJs v0.1
 * (c) 2013-2015 Chanters, Inc. http://chanters.apphb.com
 * License: MIT
 */

/**
 * ChantersJs is a JavaScript library for creating Web Components
 * ShadowRoot not supporting
 * Provides light Two-way data binding(browser supported) i.e.,
 * Object.observer(), Object.watch(), Object.defineProperties, Obect.defineProperty depends on the browser
 */

(function(window, document, undefined) {
    'use strict';
    /**
     * forEach is a function which can iterate over array as well as on Objects
     * Use Case

        @ FOR TESTING BASIC REQUIREMENT
            var obj = {
            "home": "pauri",
            "task": "working",
            "hindi": "language",
            "array": ["one", "two", "three"]
            };

            var array = ["one", obj, function() {
                console.log("array function")
            }];

        @ FOR OBJECTS USE THIS
            forEach(obj, function(key, value, index) {
                console.log("Object iterator", key, " = ", value, " = ", index);

                if (value.forEach)
                    forEach(value, function(newel, newindex, newarr) {
                        console.log("Object inner iterator function", newel, " = ", newarr, " = ", newindex);
                    })
            })

        @ FOR ARRAYS USE THIS
            forEach(array, function(el, index, arr) {
                console.log("Array iterator", el, " = ", arr, " = ", index);
            })

     **/

    var isArray = Array.isArray;

    function forEach(obj, iterator) {

        if (isArray(obj))
            obj.forEach(function(element, index, array) {
                if (iterator.call)
                    iterator.call(window, element, index, array);

            });

        else if (isObject(obj))
            Object.keys(obj).forEach(function(key, index, object) {
                if (iterator.call)
                    iterator.call(window, key, obj[key], index);

            });

        else
            throwError("Only Objects and Arrays are accepted.");

    }



    var lowercase = function(string) {
        return isString(string) ? string.toLowerCase() : string;
    };

    var uppercase = function(string) {
        return isString(string) ? string.toUpperCase() : string;
    };


    function isString(value) {
        return typeof value === 'string';
    };

    function isObject(value) {
        // http://jsperf.com/isobject4
        return value !== null && typeof value === 'object';
    }

    function isNumber(value) {
        return typeof value === 'number';
    }

    function isDate(value) {
        return toString.call(value) === '[object Date]';
    }

    function isFunction(value) {
        return typeof value === 'function';
    }

    function isWindow(obj) {
        return obj && obj.window === obj;
    }

    function isFile(obj) {
        return toString.call(obj) === '[object File]';
    }

    function isFormData(obj) {
        return toString.call(obj) === '[object FormData]';
    }

    function getNodeName(element) {
        return lowercase(element.nodeName || (element[0] && element[0].nodeName));
    }

    function arrayRemove(array, value) {
        var index = array.indexOf(value);
        if (index >= 0)
            array.splice(index, 1);
        return value;
    }


    /**
     * @description
     * Creates a deep copy of `source`, which should be an object or an array.
     *
     * * If no destination is supplied, a copy of the object or array is created.
     * * If a destination is provided, all of its elements (for arrays) or properties (for objects)
     *   are deleted and then all elements/properties from the source are copied to it.
     * * If `source` is not an object or array (inc. `null` and `undefined`), `source` is returned.
     * * If `source` is identical to 'destination' an exception will be thrown.
     *
     * @param {*} source The source that will be used to make a copy.
     *                   Can be any type, including primitives, `null`, and `undefined`.
     * @param {(Object|Array)=} destination Destination into which the source is copied. If
     *     provided, must be of the same type as `source`.
     * @returns {*} The copy or updated `destination`, if `destination` was specified.
     *
     **/
    function copy(source, destination, stackSource, stackDest) {
        if (isWindow(source) || isScope(source)) {
            throw ngMinErr('cpws',
                "Can't copy! Making copies of Window or Scope instances is not supported.");
        }

        if (!destination) {
            destination = source;
            if (source) {
                if (isArray(source)) {
                    destination = copy(source, [], stackSource, stackDest);
                } else if (isDate(source)) {
                    destination = new Date(source.getTime());
                } else if (isRegExp(source)) {
                    destination = new RegExp(source.source, source.toString().match(/[^\/]*$/)[0]);
                    destination.lastIndex = source.lastIndex;
                } else if (isObject(source)) {
                    var emptyObject = Object.create(Object.getPrototypeOf(source));
                    destination = copy(source, emptyObject, stackSource, stackDest);
                }
            }
        } else {
            if (source === destination) throw ngMinErr('cpi',
                "Can't copy! Source and destination are identical.");

            stackSource = stackSource || [];
            stackDest = stackDest || [];

            if (isObject(source)) {
                var index = stackSource.indexOf(source);
                if (index !== -1) return stackDest[index];

                stackSource.push(source);
                stackDest.push(destination);
            }

            var result;
            if (isArray(source)) {
                destination.length = 0;
                for (var i = 0; i < source.length; i++) {
                    result = copy(source[i], null, stackSource, stackDest);
                    if (isObject(source[i])) {
                        stackSource.push(source[i]);
                        stackDest.push(result);
                    }
                    destination.push(result);
                }
            } else {
                var h = destination.$$hashKey;
                if (isArray(destination)) {
                    destination.length = 0;
                } else {
                    forEach(destination, function(value, key) {
                        delete destination[key];
                    });
                }
                for (var key in source) {
                    if (source.hasOwnProperty(key)) {
                        result = copy(source[key], null, stackSource, stackDest);
                        if (isObject(source[key])) {
                            stackSource.push(source[key]);
                            stackDest.push(result);
                        }
                        destination[key] = result;
                    }
                }
                setHashKey(destination, h);
            }

        }
        return destination;
    }



    /**
     * Creates a shallow copy of an object, an array or a primitive.
     *
     * Assumes that there are no proto properties for objects.
     */
    function shallowCopy(src, dst) {
        if (isArray(src)) {
            dst = dst || [];

            for (var i = 0, ii = src.length; i < ii; i++) {
                dst[i] = src[i];
            }
        } else if (isObject(src)) {
            dst = dst || {};

            for (var key in src) {
                if (!(key.charAt(0) === '$' && key.charAt(1) === '$')) {
                    dst[key] = src[key];
                }
            }
        }

        return dst || src;
    }


    function concat(array1, array2, index) {
        return array1.concat(slice.call(array2, index));
    }

    function sliceArgs(args, startIndex) {
        return slice.call(args, startIndex || 0);
    }


    function chanters(name, prototype) {
        console.log(name, prototype);
        console.log(document.querySelector(name + " template").content);

    }
    window.chanters = chanters;
})(window, document);
