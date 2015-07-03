var helper = {
    start: function(name, properties) {
        this.init(name, properties);
        this.updateProperties();
        this.userData.proto_ = this.observer();
        this.nativeCode(properties);
        this.walkNodes(this.userData.target_);

        if (this.condition)
            this.executeCondition();

        // this check is important coz if we are giving attribute by ourself then error coming 
        // in our case see line number 28 of append function where we are setting display block value in style
        if (this.userData.target.getAttribute("attributes"))
            this.attributeObserver(this.userData.target_);

        this.copy(properties);
        this.append();
        this.domReady();
        this.cleanUp();
    },
    domReady: function() {
        if (this.userData.target_.domReady)
            this.userData.target_.domReady();
    },
    copy: function(properties) {
        this.userData.target_.templateInstance = this.userData.templateInstance;
        this.userData.target_.model = properties;
    },
    append: function() {
        // console.log(this.userData.target.parentNode)
        if (this.userData.target.parentNode) {
            this.userData.target.parentNode.replaceChild(this.userData.target_, this.userData.target);
            this.userData.target_.style.display = "block";
        }
    },
    cleanUp: function() {
        delete this.userData;
    },
    init: function(name, properties) {
        this.userData = {
            target: document.querySelector(name),
            target_: this.createTag(name),
            templateInstance: {},
            proto: properties,
            proto_: {},
            template: document.querySelector(name).querySelector('template')
        }
    },
    createTag: function(name) {
        var t = document.currentScript.previousElementSibling;
        var tag = document.createElement(name)
        var clone = document.importNode(t.content, true);
        tag.appendChild(clone);
        return tag;
    },
    updateProperties: function() {
        var t = this.userData.target;
        if (t.getAttribute("attributes")) {
            var newProps = t.getAttribute("attributes").split(" ") || [];
            var target = this.userData.target_,
                that = this;
            // Todo :: make one foreach function and pass callback function to execute
            newProps.forEach(function(element) {
                var name = element.split(":")[0];
                var value = element.split(":")[1];
                target.setAttribute(name, value);
                that.userData.proto[name] = value;
            });
        }
    },
    nativeCode: function(properties) {
        var that = this.userData.proto_;
        Object.keys(properties).forEach(function(element) {
            if (typeof properties[element] === "function") {
                properties[element] = properties[element].bind(that);
            }
        })
    },
    walkNodes: function(t, o, p, k, i) {
        if (t.childNodes.length > 0) {
            var child = t.firstChild;
            while (child) {
                if (o) {
                    child.objname = o;
                    child.key_ = k;
                    child.index = i;
                    // console.log(k);
                }
                // if (child.tagName === "INPUT" && k === "ghost")
                //     console.log(child, child.value, k);
                if (!p || child.nodeType === 3) {
                    this.filter(child);
                }
                this.walkNodes(child, o, p, k, i);
                child = child.nextSibling;
            }
        }
    },
    filter: function(n) {
        //here all nodes are available
        if (!n.processed)
            if (this.ifTextContent(n) && n.childNodes.length < 1 && n.nodeType !== 8)
            // only textNodes are available here
            // this part is important for text Binding
                this.processTextNodes(n);

            else if (n.nodeType === 1) {
            // non-textNodes
            // this part is important for attributes Binding

            if (n.nodeName === "TEMPLATE") {
                // here if template repeater are present
                // console.log(n);
                this.specialTemplate(n);
            } else
            // and attribute binding for node type===1
                this.processAttr(n);
        }
    },
    ifTextContent: function(n) {
        if (n.textContent.trim().length)
            return true;
        else
            return false;
    },
    processAttr: function(n) {
        // textbox data binding input special
        if (n.nodeName === "INPUT") {
            if (n.value.indexOf(".") === -1)
                this.inputBinding(n);
            else {
                // console.log("input special", n, n.value);
                this.repeaterInputBinding(n);
            }
        }

        // event binding like onclick
        else
            this.attributeBindig(n);
    },
    attributeBindig: function(n) {
        var eventFunction;
        for (var i = 0; i < n.attributes.length; i++) {
            var name = n.attributes[i].name.substring(3);
            if (n.attributes[i].name.indexOf("on-") !== -1) {
                var value = this.getReplaceArr(n.attributes[i].value);
            } else {
                // place for attribute binding of parent node
                var oldValue = n.attributes[i].value;
                var name = n.attributes[i].name;

                var replaceArr_ = this.getReplaceArr(oldValue);
                var replaceWith = this.getReplaceWith(replaceArr_);


                if (replaceArr_) {
                    this.mappingAttribute(n, replaceArr_);
                    var newValue = this.performBinding(n, replaceArr_, replaceWith, oldValue)
                    n.attributes[i].value = newValue;
                }
            }

            if (value) {
                value = value[0];
                eventFunction = this.userData.proto[value];
                n.removeAttribute(n.attributes[i].name);
            }

            if (eventFunction)
                this.registerElement(n, name, eventFunction);

        }
        if (n.firstChild && n.firstChild.textContent.trim().length && n.childNodes.length < 1)
            this.processTextNodes(n.firstChild);

    },
    mappingAttribute: function(n, prop) {
        var prop_ = prop || [],
            that = this,
            obj = {};
        if (!this.userData.target_.attributeInstance)
            this.userData.target_.attributeInstance = {};

        prop_.forEach(function(element) {
            if (!that.userData.target_.attributeInstance[element])
                that.userData.target_.attributeInstance[element] = [];

            obj['node'] = n;
            obj['value'] = n.outerHTML;
            that.userData.target_.attributeInstance[element].push(obj);
        })
    },
    performBinding: function(n, from, With, str_) {
        var str = str_ || n.textContent;
        for (var i = 0; i < from.length; i++) {
            str = str.replace(new RegExp('{{' + from[i] + '}}', 'gi'), With[i]);
            if (!str_)
                n.textContent = str;
        }
        if (str_)
            return str;
    },
    processTextNodes: function(n) {
        // finding replaceArr and replaceWith
        var replaceArr = this.getReplaceArr(n.textContent);
        if (replaceArr)
            if (replaceArr[0].indexOf(".") === -1) {
                var replaceWith = this.getReplaceWith(replaceArr);
                // creating template instance first for raw nodes
                this.mapping(n, replaceArr);
                this.performBinding(n, replaceArr, replaceWith);
            } else {
                if (n.childNodes.length < 1)
                    this.repeaterTextNodes(n);
            }

    },
    mapping: function(n, arr) {
        if (arr)
            for (var i = 0; i < arr.length; i++) {
                if (!this.userData.templateInstance[arr[i]]) {
                    this.userData.templateInstance[arr[i]] = [];
                    this.userData.templateInstance[arr[i]].push({
                        "node": n,
                        "value": n.textContent
                    })
                } else {
                    this.userData.templateInstance[arr[i]].push({
                        "node": n,
                        "value": n.textContent
                    })
                }
            }
    },
    inputBinding: function(n) {
        var key = this.getReplaceArr(n.value);
        // change input value
        if (key && this.userData.proto[key[0]]) {
            n.value = this.userData.proto[key[0]];
            this.inputListerner(n, key[0], true);
            this.attributeBindig(n);
            // adding input to template instance
            this.mapping(n, key);
        }

    },
    inputListerner: function(n, key, flagFirstLevel) {
        var raw;
        // flagFirstLevel is when input is binded with first level obj property
        if (n.objname && !flagFirstLevel) {
            var obj = n.key_ || n.objname || this.obj || this.proto[n.objname][n.index];
            key = key[0];

            var raw = function(event) {
                // console.log("repeater", event.target.value);
                var n = event.target;
                this.target = event.target;
                this[n.key_][n.index][key] = event.target.value;
            }

        } else {
            raw = function(event) {
                this.target = event.target;
                this[key] = event.target.value;
            }
        }

        n.removeAttribute("value");
        var processed = raw.bind(this.userData.proto_);
        this.registerElement(n, "input", processed);
    },
    registerElement: function(n, eventName, functionBody) {
        n.addEventListener(eventName, functionBody);
    },
    getReplaceArr: function(str) {
        if (str.indexOf("{{") !== -1)
            return str.trim().match(/{{\s*[\w\.]+\s*}}/g).map(function(x) {
                return x.match(/[\w\.]+/)[0];
            });
    },
    getReplaceWith: function(replaceArr, obj) {
        var replaceWith = [],
            o = obj || this.userData.proto;
        if (replaceArr && replaceArr.length > 0) {
            replaceArr.forEach(function(from) {
                Object.keys(o).forEach(function(With) {
                    if (from === With) {
                        replaceWith.push(o[With]);
                    }
                })
            })
        }
        return replaceWith;
    },
    specialTemplate: function(n) {
        if (n.tagName === "TEMPLATE") {
            // console.log(n);
            if (!this.condition) {
                this.condition = [];
                this.count = 0;
            }
            this.walkDeepNodes(n, this.condition, this.count);
            // console.log(this.condition);
        } else {
            // console.log("specialTemplate", n, this.condition);
            // this.executeCondition();
        }
    },
    walkDeepNodes: function(t, condition) {
        // var count_ = count_ || count;

        var obj = obj || {};

        if (t.nodeName === "TEMPLATE") {

            if (t.getAttribute('repeat')) {
                obj['markup'] = t.getAttribute('repeat');
                obj['type'] = 'repeat';
                obj['clone'] = this.cloneTemplate(t);
                obj['parent'] = t.parentNode;
                if (t.nextSibling.parentNode.nodeName === "#document-fragment")
                    console.log("d");
                else
                    obj['nextSibling_'] = t.nextElementSibling || t.nextSibling;
                this.executeRepeat(t);
                obj['obj'] = this.obj;
                obj['key_'] = this.key_;
            } else {
                obj['type'] = 'if';
                obj['markup'] = t.getAttribute('if');
                obj['clone'] = this.cloneTemplate(t);
                obj['parent'] = t.parentNode;
                obj['nextSibling_'] = t.nextSibling;
                this.executeIf(t);
                obj['obj'] = this.obj;
                obj['key_'] = this.key_;
            }
            obj.template = t;
            t = t.content;
        }

        obj.children = [];
        condition.push(obj);
        if (t.childNodes.length > 0) {
            for (var i = 0; i < t.childNodes.length; i++) {
                var child = t.childNodes[i];
                this.walkDeepNodes(child, obj.children);
            }
        }
    },
    cloneTemplate: function(t) {
        var t_ = document.createElement("template");
        t_.innerHTML = t.innerHTML;
        return t_;
    },
    executeRepeat: function(t) {
        // console.log(t);
        var str = t.getAttribute("repeat");
        var condition = str.substring(2, str.length - 2).trim();
        var repeatString = condition.split(' ');
        var obj = this.userData.proto[repeatString[2]];
        this.obj = obj;
        this.key_ = repeatString[2];
    },
    executeCondition: function(condition) {
        var condition_ = condition || this.condition,
            that = this;
        condition_.forEach(function(element) {
            that.processRepeater(element);
            that.executeCondition(element.children);
        })
    },
    executeIf: function(t) {
        var str = t.getAttribute("if");
        var condition = str.substring(2, str.length - 2).trim();

        var key, operator, value = "";
        key = condition.substring(0, condition.indexOf("="));

        if (key.indexOf(".") !== -1) {
            value = condition.substring(condition.indexOf("'") + 1, condition.lastIndexOf("'"));
            this.obj = this.userData.proto[this.key_];
        } else {
            this.obj = this.userData.proto[key];
        }
    },
    If: function(element) {
        //working code for if condition in template
        var str = element.markup;
        var condition = str.substring(2, str.length - 2).trim();
        var key, operator, value = "";
        key = condition.substring(0, condition.indexOf("="));
        value = condition.substring(condition.indexOf("'") + 1, condition.lastIndexOf("'"));

        var key_ = "el" + key.substring(key.indexOf('.'));
        var that = this;
        var nextSibling_ = that.nextSibling_;
        var instance_ = document.createDocumentFragment();

        element.obj.forEach(function(el, index) {
            if (eval(key_) == value && element.template) {
                instance_ = document.importNode(element.clone.content, true)
                that.walkNodes(instance_, el, "", element.key_, index);
                that.nextSibling_.parentNode.insertBefore(instance_, nextSibling_);
            }
        })


    },
    processRepeater: function(element) {
        // console.log(element);
        if (element.type) {
            if (typeof element.obj === "string" && element.type === "if") {
                this.If_(element);
            } else
            if (element.type === "if")
                this.If(element);


            if (element.type === "repeat")
                this.forEach_(element);
        }
    },
    forEach_: function(element) {
        // todo :: fix insertbefore logic,
        // currently nextSibling_ is stored from walkDeepNodes
        // else do something with executing conditions and insertBefore
        var array_ = element.obj || [],
            instance_ = document.createDocumentFragment(),
            nextSibling_ = element.nextSibling_,
            that = this;
        array_.forEach(function(obj, index) {
            instance_ = document.importNode(element.clone.content, true);
            that.walkNodes(instance_, obj, undefined, element.key_, index);
            if (!that.nextSibling_)
                that.nextSibling_ = nextSibling_;
            that.cleanInstanceTemplate(instance_);
            that.nextSibling_.parentNode.insertBefore(instance_, nextSibling_);
        })
        element.template.innerHTML = "";
    },
    repeaterTextNodes: function(n) {
        // console.log(n);
        var obj = n.objname;
        // console.log(n.objname, n.key_);

        var replaceArr = this.getReplaceArr(n.textContent);

        // cleanUp replaceArr contains unnecessary markup
        // and storing in temperary replace array
        var replaceArr_ = this.cleanUpReplaceArr(replaceArr);
        var replaceWith = this.getReplaceWith(replaceArr_, obj);

        this.mappingRepeater(n, replaceArr_);

        this.performBinding(n, replaceArr, replaceWith);

    },
    cleanUpReplaceArr: function(replaceArr) {
        var newReplaceArr = [];
        replaceArr.forEach(function(key) {
            var str = key.substring(key.indexOf(".") + 1);
            newReplaceArr.push(str);
        })
        return newReplaceArr;
    },
    mappingRepeater: function(n, key) {
        var k = n.key_,
            i = n.index;


        for (var index = 0; index < key.length; index++) {
            newKey = key[index];
            if (!this.userData.templateInstance[k]) {
                this.userData.templateInstance[k] = [];
            }

            if (!this.userData.templateInstance[k][i])
                this.userData.templateInstance[k][i] = {};

            if (!this.userData.templateInstance[k][i][newKey]) {
                this.userData.templateInstance[k][i][newKey] = [];
                this.userData.templateInstance[k][i][newKey].push({
                    "node": n,
                    "value": n.textContent
                })
            } else {
                this.userData.templateInstance[k][i][newKey].push({
                    "node": n,
                    "value": n.textContent
                })
            }

        }
    },
    repeaterInputBinding: function(n) {
        var obj = n.objname;
        // console.log(n.value);
        var key = this.getReplaceArr(n.value);

        var key_ = this.cleanUpReplaceArr(key);

        n.value = obj[key_[0]];

        this.inputListerner(n, key_);
        this.attributeBindig(n);
        this.mappingRepeater(n, key_);
    },
    cleanInstanceTemplate: function(instance_) {
        var t = instance_.querySelectorAll('template');
        for (var i = 0; i < t.length; i++) {
            t[i].innerHTML = "";
        }
    },
    arrayWatcher: function(o, key, v, t, i, a) {
        if (o[i][key] !== v) {
            var obj = {
                instance: "array",
                arrayName: a,
                index: i,
                name: key,
                obj: o,
                oldValue: o[i][key],
                type: "updated"
            }
        } else {
            var obj = {
                instance: "array",
                arrayName: a,
                index: i,
                name: key,
                obj: o,
                oldValue: o[i][key],
                type: "updated"
            }
        }
        return obj;
    },
    observingRepeater: function(tag, o) {
        var that = this;
        var index = o.index;
        var objThat = o.obj[index];
        var affectedArray = o.name;
        var affectedProperty = o.arrayName;

        // if templateInstance have affectedProperty then taking same in affectedNodes else empty array
        var affectedNodes = tag.templateInstance[affectedProperty] ? tag.templateInstance[affectedProperty][index][o.name] : [];
        affectedNodes.forEach(function(element) {
            if (element.node.tagName === "INPUT") {

                if (element.node !== tag.target) {
                    element.node.value = objThat[o.name];
                }
            } else {
                var rawTextContent = element.value;
                var replaceArr = that.getReplaceArr(rawTextContent);
                var replaceArr_ = that.cleanUpReplaceArr(replaceArr);
                var replaceWith = that.getReplaceWith(replaceArr_, objThat);

                element.node.textContent = rawTextContent;
                that.performBinding(element.node, replaceArr, replaceWith);
            }
        })
        delete tag.target;
    },
    observer: function() {
        var that = this,
            properties = this.userData.proto,
            d = this.userData.target_;

        Object.keys(properties).forEach(function(prop) {
            if (typeof properties[prop] !== "object") {
                Object.defineProperty(d, prop, {
                    get: function() {
                        // console.log("get");
                        return properties[prop];
                    },
                    set: function(val) {
                        var changer = helper.watcher(properties, prop, val);
                        // console.log("get");
                        properties[prop] = val;
                        helper.observing(this, changer);
                    },
                    enumerable: true
                })
            } else {
                that.observerArray(properties[prop], d, prop);
            }
        }, d);
        return d;
    },
    watcher: function(o, k, v) {
        if (o[k] !== v) {
            var obj = {
                name: k,
                obj: o,
                oldValue: o[k],
                type: "updated"
            }
        } else {
            var obj = {
                name: k,
                obj: o,
                oldValue: o[k],
                type: ""
            }
        }
        return obj;
    },
    observing: function(tag, o) {
        var that = this;
        objThat = o.obj;
        var affectedProperty = o.name;
        var affectedNodes = tag.templateInstance[o.name] || [];
        this.observingAttribute(tag, undefined, affectedProperty);

        affectedNodes.forEach(function(element) {
            if (element.node.tagName === "INPUT") {

                if (element.node !== tag.target) {
                    element.node.value = objThat[affectedProperty];
                }

            } else {
                var rawTextContent = element.value;
                var replaceArr = that.getReplaceArr(rawTextContent);
                var replaceWith = [];

                if (replaceArr && replaceArr.length > 0) {
                    replaceArr.forEach(function(from) {
                        Object.keys(objThat).forEach(function(With) {
                            if (from === With) {
                                replaceWith.push(objThat[With]);
                            }
                        })
                    })
                    element.node.textContent = rawTextContent;
                    that.performBinding(element.node, replaceArr, replaceWith);
                }
            }
        });
    },
    observerArray: function(properties, tag, propertyName) {
        // var arr = [];
        // properties.tag = d.tagName;
        tag[propertyName] = [];

        properties.forEach(function(element, index) {
            tag[propertyName][index] = {};

            Object.keys(element).forEach(function(prop) {
                var descriptors = new Object();
                descriptors[prop] = new Object();

                descriptors[prop].set = function(val) {
                    // console.log("set");
                    var changer = helper.arrayWatcher(properties, prop, val, tag, index, propertyName)
                    element[prop] = val;
                    helper.observingRepeater(tag, changer);
                };
                descriptors[prop].get = function() {
                    // console.log("get accessor");
                    return element[prop];
                };
                descriptors[prop].enumerable = true;
                descriptors[prop].configurable = true;

                Object.defineProperties(tag[propertyName][index], descriptors);
            }, tag)
        })
    },
    attributeObserver: function(n) {
        var that = this;
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                that.observingAttribute(n, mutation);
                n[mutation.attributeName] = n.getAttribute(mutation.attributeName); // changing textContent
            });
        });

        var config = {
            attributes: true
        };
        observer.observe(n, config);
    },
    observingAttribute: function(n, mutation, attr) {
        var affectedAttribute = attr || mutation.attributeName,
            that = this;
        var affectedNodes = n.attributeInstance && n.attributeInstance[affectedAttribute] || [];

        affectedNodes.forEach(function(element) {
            var oldNode = that.getNode(element.value),
                newNode = element.node;

            for (var i = 0; i < oldNode.attributes.length; i++) {
                var name = oldNode.attributes[i].name;
                var value = oldNode.attributes[i].value;

                var replaceArr_ = that.getReplaceArr(value);
                var replaceWith = that.getReplaceWith(replaceArr_, n.model);

                if (replaceArr_) {
                    var newValue = that.performBinding(n, replaceArr_, replaceWith, value);
                    newNode.setAttribute(name, newValue);
                }
            }
        })

        if (n[affectedAttribute + "_"] && typeof n[affectedAttribute + "_"] === "function") {
            n[affectedAttribute + "_"]();
        }
    },
    getNode: function(str) {
        var div = document.createElement(div);
        div.innerHTML = str;
        return div.children[0];
    }
};



var Chanters = function(name, properties) {
    // here this is window
    if (name && typeof name === "object")
        throw "please provide template name";
    this.start(name, properties);
}.bind(helper);
