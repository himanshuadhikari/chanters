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
        // webComponent.walkNodes();
    }

    function WebComponent(node, proto) {
        var node_ = node;
        var prototype_ = {};
        var template = node_.querySelector("template");

        this.node = this.createHTMLElement(node.nodeName);
        this.node.appendChild(document.importNode(template.content, true));
        this.node.prototype = proto;
        this.node.templateInstance = {};

        this.iterateOverNodes = function(node_) {
            var self = this;
            var getters = new Getters(this.node);
            var setters = new Setters(this.node, proto);
            var observer = new Observers(this.node, proto);
            observer.observe();

            walkNodes(this.node, function(node) {
                getters.init(node);
                setters.init(node);
            });

        }

        this.iterateOverNodes(node_);

        return this.node;

    }

    function Observers(target, object) {
        this.observer = Object.observe || Object.watch,
            this.target = target;
        var self = this;
        self.object = {};

        forEach(object, function(key, value) {
            if (typeof value !== "function")
                self.object[key] = value;
        })

    }

    Observers.prototype.observe = function() {
        var tag = this.target,
            self = this;
        this.setObject();

        if (Object.watch) {
            // for firefox
            forEach(tag.prototype, function(key) {
                if (tag.prototype[key] && typeof tag.prototype[key] !== "function")
                    tag.watch(key, function(id, oldvalue, newvalue) {
                        debugger;

                        // code here for firefox

                        // forLoop(changes, function(change) {
                        //     self.watchers(change);
                        // });
                    });
            })

        } else {
            // for chrome
            this.observer(this.target, function(changes) {
                forLoop(changes, function(change) {
                    self.watchers(change);
                })
            })
        }


    }

    Observers.prototype.watchers = function(change) {
        var affectedProperty = change.name,
            self = this,
            affectedNodes = this.target && this.target.templateInstance && this.target.templateInstance[change.name] || [];
        if (affectedNodes.length)
            forLoop(affectedNodes, function(object) {

                // for input fields binding
                if (object.node.nodeName === "INPUT" && self.target.prototype.target !== object.node) {
                    object.node.value = change.object.query;
                } else if (object.node.nodeName === "#text") {
                    var rawTextContent = object.value;
                    var replaceArr = getReplaceArr(rawTextContent);
                    var replaceWith = [];

                    if (replaceArr.length)
                        replaceArr.forEach(function(from) {
                            replaceWith.push(self.target[from]);
                        })

                    object.node.textContent = rawTextContent;
                    performBinding(object.node, replaceArr, replaceWith);
                }
            })

        delete self.target.event;
    }

    Observers.prototype.setObject = function() {
        var self = this;
        forEach(this.object, function(key, value) {
            self.target[key] = self.object[key];
        })
    }

    function Setters(tag, proto) {
        this.node = tag;
        this.prototype = proto;
    }

    Setters.prototype.init = function(node, object, iteratorObject) {
        if (!this.node) {
            this.prototype_ = object;
        }
        var self = this;
        // debugger;
        if (node && node.prototype) {
            forEach(node.prototype, function(key) {
                if (key === "events")
                    self.setEvents(node);
                else if (key === "texts")
                    self.setText(node, iteratorObject);
                else if (key === "repeaters")
                    executeRepeaters(node, self.prototype);
            })
        }
    }

    function cloneTemplate(t) {
        var t_ = document.createElement("template");
        t_.innerHTML = t.innerHTML;
        return t_;
    }

    function executeRepeaters(node, object) {
        var clone = cloneTemplate(node);
        // var clone = document.createElement("template");
        var repeaterInfo = node.prototype.repeaters[0];
        var templateObject = repeaterInfo.object;

        // console.log(node);

        forEach(templateObject, function(value, index) {
            var clone = cloneTemplate(node);
            if (typeof value !== "object") {
                walkNodes(clone.content, function(node_) {
                    Getters.prototype.init(node_);
                    console.log(node_);
                })
            } else if (typeof value === "object") {
                // console.log("repeating on array of object", object);

            }
            // debugger;
        })

        // forEach(iteratorObject, function(value) {
        //     if (typeof value !== "object") {
        //         var newNode = document.importNode(node.content, true);
        //         node.parentNode.insertBefore(newNode, node.nextSibling);
        //         // giving newNode i.e last child of 
        //         node.parentNode.lastElementChild.value = value;
        //     }
        // })
        // console.log(newNode, repeaterInfo, iteratorObject);

        // forLoop(node.prototype.repeaters, function(repeaterObject) {
        // walkNodes(clone.content, function(node_) {
        //     Getters.prototype.init(node_);
        //     forLoop(iteratorObject, function(value) {
        //         Setters.prototype.init(node_, object, iteratorObject);
        //     })
        // })

    }



    Setters.prototype.setEvents = function(node) {
        var self = this;
        if (!self.prototype)
            self.prototype = self.prototype_;
        forLoop(node.prototype.events, function(eventObject) {
            if (self.prototype[eventObject.callback]) {
                if (node.tagName === "INPUT") {
                    var callback = function(event) {
                        this.prototype.target = event.target;
                        this[eventObject.callback] = event.target.value;
                    }.bind(self.node);

                    self.mapNodes(node, eventObject.callback);
                    node.value = self.prototype[eventObject.callback];
                    node.removeAttribute("value");

                    if (self.prototype[eventObject.callback] && typeof self.prototype[eventObject.callback] === "function") {
                        var callback = self.prototype[eventObject.callback].bind(self.node);
                    }

                } else {
                    var callback = self.prototype[eventObject.callback].bind(self.node);
                }
                registerElement(node, eventObject.eventName, callback);

            }
        })
    }

    Setters.prototype.setText = function(node, iteratorObject) {
        var self = this;
        // debugger;
        var replaceWith = this.replaceWith(node.prototype.texts, node);
        if (replaceWith && replaceWith.length) {
            performBinding(node, node.prototype.texts, replaceWith);
        }
    }

    Setters.prototype.mapNodes = function(node, key) {
        if (!this.node.templateInstance[key])
            this.node.templateInstance[key] = [];

        this.node.templateInstance[key].push({
            "node": node,
            "value": node.textContent
        })
    }

    Setters.prototype.replaceWith = function(arr, node) {
        var replaceWith = [],
            self = this;
        forLoop(arr, function(key) {
            if (self.prototype[key]) {
                self.mapNodes(node, key)
                replaceWith.push(self.prototype[key]);
            }
        })
        return replaceWith;
    }

    function performBinding(n, from, With, str_) {
        var str = str_ || n.textContent;
        for (var i = 0; i < from.length; i++) {
            str = str.replace(new RegExp('{{' + from[i] + '}}', 'gi'), With[i]);
            if (!str_)
                n.textContent = str;
        }
        if (str_)
            return str;
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



    WebComponent.prototype.createHTMLElement = function(tagName) {
        return document.createElement(tagName);
    }

    function Getters(tag) {
        this.node = tag;
    }

    Getters.prototype.init = function(node, nodeObject) {
        if (ifTextContent(node) && node.nodeType === 1)
            this.getEvents(node);
        else if (ifTextContent(node) && node.nodeType === 3) {
            this.getText(node, nodeObject);
        } else if (node.nodeName === "INPUT") {
            this.getInputEvents(node);
        } else if (node.nodeName === "TEMPLATE")
            this.getRepeaters(node);
    }

    Getters.prototype.getRepeaters = function(node) {
        if (!node.prototype)
            node.prototype = {};

        if (!node.prototype.repeaters)
            node.prototype.repeaters = [];

        var repeaterString = node.getAttribute("repeat");

        node.prototype.repeaters.push({
            "str": repeaterString,
            "value": repeaterString.split(" ")[2],
            "key": repeaterString.split(" ")[0],
            "object": this.node.prototype[repeaterString.split(" ")[2]] || []
        });
    }

    Getters.prototype.getEvents = function(node) {
        forLoop(node.attributes, function(nodeAttributes) {
            if (nodeAttributes.name.indexOf("on-") !== -1) {
                var events = {
                    "eventName": nodeAttributes.name.substring(3),
                    "callback": getReplaceArr(nodeAttributes.value)[0]
                }
                if (!node.prototype)
                    node.prototype = {};

                if (!node.prototype.events)
                    node.prototype.events = [];

                node.prototype.events.push(events);
            }
        });
    }

    Getters.prototype.getInputEvents = function(node) {
        var value = node.value;
        this.getEvents(node);

        if (getReplaceArr(value)) {
            var events = {
                "eventName": 'input',
                "callback": getReplaceArr(node.value)[0]
            }
            if (!node.prototype)
                node.prototype = {};

            if (!node.prototype.events)
                node.prototype.events = [];

            node.prototype.events.push(events);
        }
    }

    Getters.prototype.getText = function(node) {
        var str = node.textContent;
        var self = this;
        if (getReplaceArr(str)) {
            var keys = getReplaceArr(str);

            if (keys && keys.length) {
                forLoop(keys, function(value) {
                    if (!node.prototype)
                        node.prototype = {};

                    if (!node.prototype.texts)
                        node.prototype.texts = [];

                    node.prototype.texts.push(value);
                })
            }

        }



        // console.log(getReplaceArr(str));
    }


    function registerElement(n, eventName, callback) {
        n.addEventListener(eventName, callback);
    }


    function ifTextContent(n) {
        if (n.textContent.trim().length)
            return true;
        else
            return false;
    }

    function getReplaceArr(str) {
        if (str.indexOf("{{") !== -1)
            return str.trim().match(/{{\s*[\w\.]+\s*}}/g).map(function(x) {
                return x.match(/[\w\.]+/)[0];
            });
    }



    window.Chanters = Chanters;
})(window, document);
