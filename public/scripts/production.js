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

    var throwError = function(errMssg) {
        throw errMssg;
    };


    var forEach = function(obj, iterator) {
        if (obj instanceof Array)
            obj.forEach(function(element, index, array) {
                if (iterator.call)
                    iterator.call(window, element, index, array);

            });

        else if (typeof obj === "object")
            Object.keys(obj).forEach(function(key, index, object) {
                if (iterator.call)
                    iterator.call(window, key, obj[key], index);

            });

        else
            throwError("Only Objects and Arrays are accepted.");

    }


})(window, document);
