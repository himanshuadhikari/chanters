/**
 * @license ChantersJs v0.5
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

    function forLoop(arr, callback) {
        if (arr && arr.length)
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] && typeof callback === "function")
                    callback(arr[i], i);
            }
    }

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


    function concat(array1, array2, index) {
        return array1.concat(slice.call(array2, index));
    }

    function sliceArgs(args, startIndex) {
        return slice.call(args, startIndex || 0);
    }

    function createHTMLElement(tagName) {
        return document.createElement(tagName);
    }

    function ifTextContent(n) {
        if (n.textContent.trim().length)
            return true;
        else
            return false;
    }

    window.Chanters = Chanters;

    function Chanters(name, prototype) {
        if (name && typeof name === "object")
            throw "please provide template name";
        else {
            init(name, prototype);
        }
    }

    function init(name, prototype) {
        var node = document.querySelector(name);
        var webComponent = new WebComponent(node, prototype);

        node.parentNode.replaceChild(webComponent, node);
        // console.log(webComponent);
    }

    function WebComponent(node, proto) {
        var template = node.querySelector("template");

        this.node = createHTMLElement(getNodeName(node));
        this.proto = proto;


        this.node.appendChild(document.importNode(template.content, true));
        this.node.prototype = proto;
        this.node.templateInstance = {};


        var getter = new Getters(this.node);

        return this.node;
    }



    function Getters(node) {
        this.node = node;
        this.getter = [];

        this.createGetter();

        return this.getter;
    }

    Getters.prototype.createGetter = function() {
        var self = this;
        walkNodes(this.node, function(n) {
            self.filterNode(n);
        })
    }

    Getters.prototype.filterNode = function(node, nodeObject) {
        if (ifTextContent(node) && node.nodeType === 1) {
            console.log("attribute binding", node);
        } else if (ifTextContent(node) && node.nodeType === 3) {
            console.log("text binding", node);
        } else if (node.nodeName === "INPUT") {
            console.log("INPUT binding", node);
        } else if (node.nodeName === "TEMPLATE") {
            console.log("templates binding", node);
        }
    }


    function walkNodes(node, callback) {
        if (node.childNodes.length > 0) {
            var child = node.firstChild;
            while (child) {
                if (callback && typeof callback === "function")
                    callback(child);

                walkNodes(child, callback);
                child = child.nextSibling;
            }
        }
    }



})(window, document, undefined);
