/******/ var __webpack_modules__ = ({

/***/ 800:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(918);
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(267);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".sakana-widget *,.sakana-widget *::before,.sakana-widget *::after{box-sizing:border-box}.sakana-widget-wrapper{pointer-events:none;position:relative;width:100%;height:100%}.sakana-widget-app{pointer-events:none;position:relative}.sakana-widget-canvas{z-index:10;pointer-events:none;position:absolute}.sakana-widget-main{z-index:20;pointer-events:none;position:absolute;display:flex;flex-direction:column;justify-content:space-between;align-items:center}.sakana-widget-img{z-index:40;cursor:move;pointer-events:auto;position:relative;background:no-repeat 50% 50%;background-size:cover}.sakana-widget-ctrl{z-index:30;cursor:pointer;pointer-events:auto;position:relative;height:24px;width:112px;display:flex;border-radius:4px;background-color:#ddd;box-shadow:0 8px 24px rgba(0,0,0,.1)}.sakana-widget-ctrl-item{height:24px;width:28px;display:flex;justify-content:center;align-items:center;color:#555;background-color:rgba(0,0,0,0)}.sakana-widget-ctrl-item:hover{color:#555;background-color:rgba(255,255,255,.25)}.sakana-widget-icon{height:18px;width:18px}.sakana-widget-icon--rotate{animation:sakana-widget-spin 2s linear infinite}@keyframes sakana-widget-spin{100%{transform:rotate(360deg)}}", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 267:
/***/ ((module) => {


module.exports = function(cssWithMappingToString) {
  var list = [];
  list.toString = function toString() {
    return this.map(function(item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";
      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }
      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }
      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }
      content += cssWithMappingToString(item);
      if (needLayer) {
        content += "}";
      }
      if (item[2]) {
        content += "}";
      }
      if (item[4]) {
        content += "}";
      }
      return content;
    }).join("");
  };
  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, void 0]];
    }
    var alreadyImportedModules = {};
    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];
        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }
    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);
      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }
      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }
      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }
      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }
      list.push(item);
    }
  };
  return list;
};


/***/ }),

/***/ 918:
/***/ ((module) => {


module.exports = function(i) {
  return i[1];
};


/***/ }),

/***/ 379:
/***/ ((module) => {



var stylesInDOM = [];

function getIndexByIdentifier(identifier) {
  var result = -1;

  for (var i = 0; i < stylesInDOM.length; i++) {
    if (stylesInDOM[i].identifier === identifier) {
      result = i;
      break;
    }
  }

  return result;
}

function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];

  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var indexByIdentifier = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3],
      supports: item[4],
      layer: item[5]
    };

    if (indexByIdentifier !== -1) {
      stylesInDOM[indexByIdentifier].references++;
      stylesInDOM[indexByIdentifier].updater(obj);
    } else {
      var updater = addElementStyle(obj, options);
      options.byIndex = i;
      stylesInDOM.splice(i, 0, {
        identifier: identifier,
        updater: updater,
        references: 1
      });
    }

    identifiers.push(identifier);
  }

  return identifiers;
}

function addElementStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);

  var updater = function updater(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
        return;
      }

      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };

  return updater;
}

module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];

    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDOM[index].references--;
    }

    var newLastIdentifiers = modulesToDom(newList, options);

    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];

      var _index = getIndexByIdentifier(_identifier);

      if (stylesInDOM[_index].references === 0) {
        stylesInDOM[_index].updater();

        stylesInDOM.splice(_index, 1);
      }
    }

    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ 569:
/***/ ((module) => {



var memo = {};
/* istanbul ignore next  */

function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target); // Special case to return head of iframe instead of iframe itself

    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }

    memo[target] = styleTarget;
  }

  return memo[target];
}
/* istanbul ignore next  */


function insertBySelector(insert, style) {
  var target = getTarget(insert);

  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }

  target.appendChild(style);
}

module.exports = insertBySelector;

/***/ }),

/***/ 216:
/***/ ((module) => {



/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}

module.exports = insertStyleElement;

/***/ }),

/***/ 565:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;

  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}

module.exports = setAttributesWithoutAttributes;

/***/ }),

/***/ 795:
/***/ ((module) => {



/* istanbul ignore next  */
function apply(styleElement, options, obj) {
  var css = "";

  if (obj.supports) {
    css += "@supports (".concat(obj.supports, ") {");
  }

  if (obj.media) {
    css += "@media ".concat(obj.media, " {");
  }

  var needLayer = typeof obj.layer !== "undefined";

  if (needLayer) {
    css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
  }

  css += obj.css;

  if (needLayer) {
    css += "}";
  }

  if (obj.media) {
    css += "}";
  }

  if (obj.supports) {
    css += "}";
  }

  var sourceMap = obj.sourceMap;

  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  } // For old IE

  /* istanbul ignore if  */


  options.styleTagTransform(css, styleElement, options.options);
}

function removeStyleElement(styleElement) {
  // istanbul ignore if
  if (styleElement.parentNode === null) {
    return false;
  }

  styleElement.parentNode.removeChild(styleElement);
}
/* istanbul ignore next  */


function domAPI(options) {
  var styleElement = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(styleElement, options, obj);
    },
    remove: function remove() {
      removeStyleElement(styleElement);
    }
  };
}

module.exports = domAPI;

/***/ }),

/***/ 589:
/***/ ((module) => {



/* istanbul ignore next  */
function styleTagTransform(css, styleElement) {
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild);
    }

    styleElement.appendChild(document.createTextNode(css));
  }
}

module.exports = styleTagTransform;

/***/ })

/******/ });
/************************************************************************/
/******/ // The module cache
/******/ var __webpack_module_cache__ = {};
/******/ 
/******/ // The require function
/******/ function __webpack_require__(moduleId) {
/******/ 	// Check if module is in cache
/******/ 	var cachedModule = __webpack_module_cache__[moduleId];
/******/ 	if (cachedModule !== undefined) {
/******/ 		return cachedModule.exports;
/******/ 	}
/******/ 	// Create a new module (and put it into the cache)
/******/ 	var module = __webpack_module_cache__[moduleId] = {
/******/ 		id: moduleId,
/******/ 		// no module.loaded needed
/******/ 		exports: {}
/******/ 	};
/******/ 
/******/ 	// Execute the module function
/******/ 	__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 
/******/ 	// Return the exports of the module
/******/ 	return module.exports;
/******/ }
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/compat get default export */
/******/ (() => {
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = (module) => {
/******/ 		var getter = module && module.__esModule ?
/******/ 			() => (module['default']) :
/******/ 			() => (module);
/******/ 		__webpack_require__.d(getter, { a: getter });
/******/ 		return getter;
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/define property getters */
/******/ (() => {
/******/ 	// define getter functions for harmony exports
/******/ 	__webpack_require__.d = (exports, definition) => {
/******/ 		for(var key in definition) {
/******/ 			if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/hasOwnProperty shorthand */
/******/ (() => {
/******/ 	__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ })();
/******/ 
/******/ /* webpack/runtime/nonce */
/******/ (() => {
/******/ 	__webpack_require__.nc = undefined;
/******/ })();
/******/ 
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "Z": () => (/* binding */ src_0)
});

// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js
var injectStylesIntoStyleTag = __webpack_require__(379);
var injectStylesIntoStyleTag_default = /*#__PURE__*/__webpack_require__.n(injectStylesIntoStyleTag);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/styleDomAPI.js
var styleDomAPI = __webpack_require__(795);
var styleDomAPI_default = /*#__PURE__*/__webpack_require__.n(styleDomAPI);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/insertBySelector.js
var insertBySelector = __webpack_require__(569);
var insertBySelector_default = /*#__PURE__*/__webpack_require__.n(insertBySelector);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js
var setAttributesWithoutAttributes = __webpack_require__(565);
var setAttributesWithoutAttributes_default = /*#__PURE__*/__webpack_require__.n(setAttributesWithoutAttributes);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/insertStyleElement.js
var insertStyleElement = __webpack_require__(216);
var insertStyleElement_default = /*#__PURE__*/__webpack_require__.n(insertStyleElement);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/styleTagTransform.js
var styleTagTransform = __webpack_require__(589);
var styleTagTransform_default = /*#__PURE__*/__webpack_require__.n(styleTagTransform);
// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/index.scss
var cjs_js_src = __webpack_require__(800);
;// CONCATENATED MODULE: ./src/index.scss

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (styleTagTransform_default());
options.setAttributes = (setAttributesWithoutAttributes_default());

      options.insert = insertBySelector_default().bind(null, "head");
    
options.domAPI = (styleDomAPI_default());
options.insertStyleElement = (insertStyleElement_default());

var update = injectStylesIntoStyleTag_default()(cjs_js_src/* default */.Z, options);




       /* harmony default export */ const src = (cjs_js_src/* default */.Z && cjs_js_src/* default.locals */.Z.locals ? cjs_js_src/* default.locals */.Z.locals : undefined);

;// CONCATENATED MODULE: ./node_modules/@juggle/resize-observer/lib/utils/resizeObservers.js
var resizeObservers = [];


;// CONCATENATED MODULE: ./node_modules/@juggle/resize-observer/lib/algorithms/hasActiveObservations.js

var hasActiveObservations = function() {
  return resizeObservers.some(function(ro) {
    return ro.activeTargets.length > 0;
  });
};


;// CONCATENATED MODULE: ./node_modules/@juggle/resize-observer/lib/algorithms/hasSkippedObservations.js

var hasSkippedObservations = function() {
  return resizeObservers.some(function(ro) {
    return ro.skippedTargets.length > 0;
  });
};


;// CONCATENATED MODULE: ./node_modules/@juggle/resize-observer/lib/algorithms/deliverResizeLoopError.js
var msg = "ResizeObserver loop completed with undelivered notifications.";
var deliverResizeLoopError = function() {
  var event;
  if (typeof ErrorEvent === "function") {
    event = new ErrorEvent("error", {
      message: msg
    });
  } else {
    event = document.createEvent("Event");
    event.initEvent("error", false, false);
    event.message = msg;
  }
  window.dispatchEvent(event);
};


;// CONCATENATED MODULE: ./node_modules/@juggle/resize-observer/lib/ResizeObserverBoxOptions.js
var ResizeObserverBoxOptions;
(function(ResizeObserverBoxOptions2) {
  ResizeObserverBoxOptions2["BORDER_BOX"] = "border-box";
  ResizeObserverBoxOptions2["CONTENT_BOX"] = "content-box";
  ResizeObserverBoxOptions2["DEVICE_PIXEL_CONTENT_BOX"] = "device-pixel-content-box";
})(ResizeObserverBoxOptions || (ResizeObserverBoxOptions = {}));


;// CONCATENATED MODULE: ./node_modules/@juggle/resize-observer/lib/utils/freeze.js
var freeze = function(obj) {
  return Object.freeze(obj);
};

;// CONCATENATED MODULE: ./node_modules/@juggle/resize-observer/lib/ResizeObserverSize.js

var ResizeObserverSize = function() {
  function ResizeObserverSize2(inlineSize, blockSize) {
    this.inlineSize = inlineSize;
    this.blockSize = blockSize;
    freeze(this);
  }
  return ResizeObserverSize2;
}();


;// CONCATENATED MODULE: ./node_modules/@juggle/resize-observer/lib/DOMRectReadOnly.js

var DOMRectReadOnly = function() {
  function DOMRectReadOnly2(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.top = this.y;
    this.left = this.x;
    this.bottom = this.top + this.height;
    this.right = this.left + this.width;
    return freeze(this);
  }
  DOMRectReadOnly2.prototype.toJSON = function() {
    var _a = this, x = _a.x, y = _a.y, top = _a.top, right = _a.right, bottom = _a.bottom, left = _a.left, width = _a.width, height = _a.height;
    return { x, y, top, right, bottom, left, width, height };
  };
  DOMRectReadOnly2.fromRect = function(rectangle) {
    return new DOMRectReadOnly2(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
  };
  return DOMRectReadOnly2;
}();


;// CONCATENATED MODULE: ./node_modules/@juggle/resize-observer/lib/utils/element.js
var isSVG = function(target) {
  return target instanceof SVGElement && "getBBox" in target;
};
var isHidden = function(target) {
  if (isSVG(target)) {
    var _a = target.getBBox(), width = _a.width, height = _a.height;
    return !width && !height;
  }
  var _b = target, offsetWidth = _b.offsetWidth, offsetHeight = _b.offsetHeight;
  return !(offsetWidth || offsetHeight || target.getClientRects().length);
};
var isElement = function(obj) {
  var _a;
  if (obj instanceof Element) {
    return true;
  }
  var scope = (_a = obj === null || obj === void 0 ? void 0 : obj.ownerDocument) === null || _a === void 0 ? void 0 : _a.defaultView;
  return !!(scope && obj instanceof scope.Element);
};
var isReplacedElement = function(target) {
  switch (target.tagName) {
    case "INPUT":
      if (target.type !== "image") {
        break;
      }
    case "VIDEO":
    case "AUDIO":
    case "EMBED":
    case "OBJECT":
    case "CANVAS":
    case "IFRAME":
    case "IMG":
      return true;
  }
  return false;
};


;// CONCATENATED MODULE: ./node_modules/@juggle/resize-observer/lib/utils/global.js
var global = typeof window !== "undefined" ? window : {};

;// CONCATENATED MODULE: ./node_modules/@juggle/resize-observer/lib/algorithms/calculateBoxSize.js






var cache = /* @__PURE__ */ new WeakMap();
var scrollRegexp = /auto|scroll/;
var verticalRegexp = /^tb|vertical/;
var IE = /msie|trident/i.test(global.navigator && global.navigator.userAgent);
var parseDimension = function(pixel) {
  return parseFloat(pixel || "0");
};
var size = function(inlineSize, blockSize, switchSizes) {
  if (inlineSize === void 0) {
    inlineSize = 0;
  }
  if (blockSize === void 0) {
    blockSize = 0;
  }
  if (switchSizes === void 0) {
    switchSizes = false;
  }
  return new ResizeObserverSize((switchSizes ? blockSize : inlineSize) || 0, (switchSizes ? inlineSize : blockSize) || 0);
};
var zeroBoxes = freeze({
  devicePixelContentBoxSize: size(),
  borderBoxSize: size(),
  contentBoxSize: size(),
  contentRect: new DOMRectReadOnly(0, 0, 0, 0)
});
var calculateBoxSizes = function(target, forceRecalculation) {
  if (forceRecalculation === void 0) {
    forceRecalculation = false;
  }
  if (cache.has(target) && !forceRecalculation) {
    return cache.get(target);
  }
  if (isHidden(target)) {
    cache.set(target, zeroBoxes);
    return zeroBoxes;
  }
  var cs = getComputedStyle(target);
  var svg = isSVG(target) && target.ownerSVGElement && target.getBBox();
  var removePadding = !IE && cs.boxSizing === "border-box";
  var switchSizes = verticalRegexp.test(cs.writingMode || "");
  var canScrollVertically = !svg && scrollRegexp.test(cs.overflowY || "");
  var canScrollHorizontally = !svg && scrollRegexp.test(cs.overflowX || "");
  var paddingTop = svg ? 0 : parseDimension(cs.paddingTop);
  var paddingRight = svg ? 0 : parseDimension(cs.paddingRight);
  var paddingBottom = svg ? 0 : parseDimension(cs.paddingBottom);
  var paddingLeft = svg ? 0 : parseDimension(cs.paddingLeft);
  var borderTop = svg ? 0 : parseDimension(cs.borderTopWidth);
  var borderRight = svg ? 0 : parseDimension(cs.borderRightWidth);
  var borderBottom = svg ? 0 : parseDimension(cs.borderBottomWidth);
  var borderLeft = svg ? 0 : parseDimension(cs.borderLeftWidth);
  var horizontalPadding = paddingLeft + paddingRight;
  var verticalPadding = paddingTop + paddingBottom;
  var horizontalBorderArea = borderLeft + borderRight;
  var verticalBorderArea = borderTop + borderBottom;
  var horizontalScrollbarThickness = !canScrollHorizontally ? 0 : target.offsetHeight - verticalBorderArea - target.clientHeight;
  var verticalScrollbarThickness = !canScrollVertically ? 0 : target.offsetWidth - horizontalBorderArea - target.clientWidth;
  var widthReduction = removePadding ? horizontalPadding + horizontalBorderArea : 0;
  var heightReduction = removePadding ? verticalPadding + verticalBorderArea : 0;
  var contentWidth = svg ? svg.width : parseDimension(cs.width) - widthReduction - verticalScrollbarThickness;
  var contentHeight = svg ? svg.height : parseDimension(cs.height) - heightReduction - horizontalScrollbarThickness;
  var borderBoxWidth = contentWidth + horizontalPadding + verticalScrollbarThickness + horizontalBorderArea;
  var borderBoxHeight = contentHeight + verticalPadding + horizontalScrollbarThickness + verticalBorderArea;
  var boxes = freeze({
    devicePixelContentBoxSize: size(Math.round(contentWidth * devicePixelRatio), Math.round(contentHeight * devicePixelRatio), switchSizes),
    borderBoxSize: size(borderBoxWidth, borderBoxHeight, switchSizes),
    contentBoxSize: size(contentWidth, contentHeight, switchSizes),
    contentRect: new DOMRectReadOnly(paddingLeft, paddingTop, contentWidth, contentHeight)
  });
  cache.set(target, boxes);
  return boxes;
};
var calculateBoxSize = function(target, observedBox, forceRecalculation) {
  var _a = calculateBoxSizes(target, forceRecalculation), borderBoxSize = _a.borderBoxSize, contentBoxSize = _a.contentBoxSize, devicePixelContentBoxSize = _a.devicePixelContentBoxSize;
  switch (observedBox) {
    case ResizeObserverBoxOptions.DEVICE_PIXEL_CONTENT_BOX:
      return devicePixelContentBoxSize;
    case ResizeObserverBoxOptions.BORDER_BOX:
      return borderBoxSize;
    default:
      return contentBoxSize;
  }
};


;// CONCATENATED MODULE: ./node_modules/@juggle/resize-observer/lib/ResizeObserverEntry.js


var ResizeObserverEntry = function() {
  function ResizeObserverEntry2(target) {
    var boxes = calculateBoxSizes(target);
    this.target = target;
    this.contentRect = boxes.contentRect;
    this.borderBoxSize = freeze([boxes.borderBoxSize]);
    this.contentBoxSize = freeze([boxes.contentBoxSize]);
    this.devicePixelContentBoxSize = freeze([boxes.devicePixelContentBoxSize]);
  }
  return ResizeObserverEntry2;
}();


;// CONCATENATED MODULE: ./node_modules/@juggle/resize-observer/lib/algorithms/calculateDepthForNode.js

var calculateDepthForNode = function(node) {
  if (isHidden(node)) {
    return Infinity;
  }
  var depth = 0;
  var parent = node.parentNode;
  while (parent) {
    depth += 1;
    parent = parent.parentNode;
  }
  return depth;
};


;// CONCATENATED MODULE: ./node_modules/@juggle/resize-observer/lib/algorithms/broadcastActiveObservations.js




var broadcastActiveObservations = function() {
  var shallowestDepth = Infinity;
  var callbacks = [];
  resizeObservers.forEach(function processObserver(ro) {
    if (ro.activeTargets.length === 0) {
      return;
    }
    var entries = [];
    ro.activeTargets.forEach(function processTarget(ot) {
      var entry = new ResizeObserverEntry(ot.target);
      var targetDepth = calculateDepthForNode(ot.target);
      entries.push(entry);
      ot.lastReportedSize = calculateBoxSize(ot.target, ot.observedBox);
      if (targetDepth < shallowestDepth) {
        shallowestDepth = targetDepth;
      }
    });
    callbacks.push(function resizeObserverCallback() {
      ro.callback.call(ro.observer, entries, ro.observer);
    });
    ro.activeTargets.splice(0, ro.activeTargets.length);
  });
  for (var _i = 0, callbacks_1 = callbacks; _i < callbacks_1.length; _i++) {
    var callback = callbacks_1[_i];
    callback();
  }
  return shallowestDepth;
};


;// CONCATENATED MODULE: ./node_modules/@juggle/resize-observer/lib/algorithms/gatherActiveObservationsAtDepth.js


var gatherActiveObservationsAtDepth = function(depth) {
  resizeObservers.forEach(function processObserver(ro) {
    ro.activeTargets.splice(0, ro.activeTargets.length);
    ro.skippedTargets.splice(0, ro.skippedTargets.length);
    ro.observationTargets.forEach(function processTarget(ot) {
      if (ot.isActive()) {
        if (calculateDepthForNode(ot.target) > depth) {
          ro.activeTargets.push(ot);
        } else {
          ro.skippedTargets.push(ot);
        }
      }
    });
  });
};


;// CONCATENATED MODULE: ./node_modules/@juggle/resize-observer/lib/utils/process.js





var process = function() {
  var depth = 0;
  gatherActiveObservationsAtDepth(depth);
  while (hasActiveObservations()) {
    depth = broadcastActiveObservations();
    gatherActiveObservationsAtDepth(depth);
  }
  if (hasSkippedObservations()) {
    deliverResizeLoopError();
  }
  return depth > 0;
};


;// CONCATENATED MODULE: ./node_modules/@juggle/resize-observer/lib/utils/queueMicroTask.js
var trigger;
var callbacks = [];
var notify = function() {
  return callbacks.splice(0).forEach(function(cb) {
    return cb();
  });
};
var queueMicroTask = function(callback) {
  if (!trigger) {
    var toggle_1 = 0;
    var el_1 = document.createTextNode("");
    var config = { characterData: true };
    new MutationObserver(function() {
      return notify();
    }).observe(el_1, config);
    trigger = function() {
      el_1.textContent = "".concat(toggle_1 ? toggle_1-- : toggle_1++);
    };
  }
  callbacks.push(callback);
  trigger();
};


;// CONCATENATED MODULE: ./node_modules/@juggle/resize-observer/lib/utils/queueResizeObserver.js

var queueResizeObserver = function(cb) {
  queueMicroTask(function ResizeObserver() {
    requestAnimationFrame(cb);
  });
};


;// CONCATENATED MODULE: ./node_modules/@juggle/resize-observer/lib/utils/scheduler.js



var watching = 0;
var isWatching = function() {
  return !!watching;
};
var CATCH_PERIOD = 250;
var observerConfig = { attributes: true, characterData: true, childList: true, subtree: true };
var events = [
  "resize",
  "load",
  "transitionend",
  "animationend",
  "animationstart",
  "animationiteration",
  "keyup",
  "keydown",
  "mouseup",
  "mousedown",
  "mouseover",
  "mouseout",
  "blur",
  "focus"
];
var time = function(timeout) {
  if (timeout === void 0) {
    timeout = 0;
  }
  return Date.now() + timeout;
};
var scheduled = false;
var Scheduler = function() {
  function Scheduler2() {
    var _this = this;
    this.stopped = true;
    this.listener = function() {
      return _this.schedule();
    };
  }
  Scheduler2.prototype.run = function(timeout) {
    var _this = this;
    if (timeout === void 0) {
      timeout = CATCH_PERIOD;
    }
    if (scheduled) {
      return;
    }
    scheduled = true;
    var until = time(timeout);
    queueResizeObserver(function() {
      var elementsHaveResized = false;
      try {
        elementsHaveResized = process();
      } finally {
        scheduled = false;
        timeout = until - time();
        if (!isWatching()) {
          return;
        }
        if (elementsHaveResized) {
          _this.run(1e3);
        } else if (timeout > 0) {
          _this.run(timeout);
        } else {
          _this.start();
        }
      }
    });
  };
  Scheduler2.prototype.schedule = function() {
    this.stop();
    this.run();
  };
  Scheduler2.prototype.observe = function() {
    var _this = this;
    var cb = function() {
      return _this.observer && _this.observer.observe(document.body, observerConfig);
    };
    document.body ? cb() : global.addEventListener("DOMContentLoaded", cb);
  };
  Scheduler2.prototype.start = function() {
    var _this = this;
    if (this.stopped) {
      this.stopped = false;
      this.observer = new MutationObserver(this.listener);
      this.observe();
      events.forEach(function(name) {
        return global.addEventListener(name, _this.listener, true);
      });
    }
  };
  Scheduler2.prototype.stop = function() {
    var _this = this;
    if (!this.stopped) {
      this.observer && this.observer.disconnect();
      events.forEach(function(name) {
        return global.removeEventListener(name, _this.listener, true);
      });
      this.stopped = true;
    }
  };
  return Scheduler2;
}();
var scheduler = new Scheduler();
var updateCount = function(n) {
  !watching && n > 0 && scheduler.start();
  watching += n;
  !watching && scheduler.stop();
};


;// CONCATENATED MODULE: ./node_modules/@juggle/resize-observer/lib/ResizeObservation.js



var skipNotifyOnElement = function(target) {
  return !isSVG(target) && !isReplacedElement(target) && getComputedStyle(target).display === "inline";
};
var ResizeObservation = function() {
  function ResizeObservation2(target, observedBox) {
    this.target = target;
    this.observedBox = observedBox || ResizeObserverBoxOptions.CONTENT_BOX;
    this.lastReportedSize = {
      inlineSize: 0,
      blockSize: 0
    };
  }
  ResizeObservation2.prototype.isActive = function() {
    var size = calculateBoxSize(this.target, this.observedBox, true);
    if (skipNotifyOnElement(this.target)) {
      this.lastReportedSize = size;
    }
    if (this.lastReportedSize.inlineSize !== size.inlineSize || this.lastReportedSize.blockSize !== size.blockSize) {
      return true;
    }
    return false;
  };
  return ResizeObservation2;
}();


;// CONCATENATED MODULE: ./node_modules/@juggle/resize-observer/lib/ResizeObserverDetail.js
var ResizeObserverDetail = function() {
  function ResizeObserverDetail2(resizeObserver, callback) {
    this.activeTargets = [];
    this.skippedTargets = [];
    this.observationTargets = [];
    this.observer = resizeObserver;
    this.callback = callback;
  }
  return ResizeObserverDetail2;
}();


;// CONCATENATED MODULE: ./node_modules/@juggle/resize-observer/lib/ResizeObserverController.js




var observerMap = /* @__PURE__ */ new WeakMap();
var getObservationIndex = function(observationTargets, target) {
  for (var i = 0; i < observationTargets.length; i += 1) {
    if (observationTargets[i].target === target) {
      return i;
    }
  }
  return -1;
};
var ResizeObserverController = function() {
  function ResizeObserverController2() {
  }
  ResizeObserverController2.connect = function(resizeObserver, callback) {
    var detail = new ResizeObserverDetail(resizeObserver, callback);
    observerMap.set(resizeObserver, detail);
  };
  ResizeObserverController2.observe = function(resizeObserver, target, options) {
    var detail = observerMap.get(resizeObserver);
    var firstObservation = detail.observationTargets.length === 0;
    if (getObservationIndex(detail.observationTargets, target) < 0) {
      firstObservation && resizeObservers.push(detail);
      detail.observationTargets.push(new ResizeObservation(target, options && options.box));
      updateCount(1);
      scheduler.schedule();
    }
  };
  ResizeObserverController2.unobserve = function(resizeObserver, target) {
    var detail = observerMap.get(resizeObserver);
    var index = getObservationIndex(detail.observationTargets, target);
    var lastObservation = detail.observationTargets.length === 1;
    if (index >= 0) {
      lastObservation && resizeObservers.splice(resizeObservers.indexOf(detail), 1);
      detail.observationTargets.splice(index, 1);
      updateCount(-1);
    }
  };
  ResizeObserverController2.disconnect = function(resizeObserver) {
    var _this = this;
    var detail = observerMap.get(resizeObserver);
    detail.observationTargets.slice().forEach(function(ot) {
      return _this.unobserve(resizeObserver, ot.target);
    });
    detail.activeTargets.splice(0, detail.activeTargets.length);
  };
  return ResizeObserverController2;
}();


;// CONCATENATED MODULE: ./node_modules/@juggle/resize-observer/lib/ResizeObserver.js


var ResizeObserver = function() {
  function ResizeObserver2(callback) {
    if (arguments.length === 0) {
      throw new TypeError("Failed to construct 'ResizeObserver': 1 argument required, but only 0 present.");
    }
    if (typeof callback !== "function") {
      throw new TypeError("Failed to construct 'ResizeObserver': The callback provided as parameter 1 is not a function.");
    }
    ResizeObserverController.connect(this, callback);
  }
  ResizeObserver2.prototype.observe = function(target, options) {
    if (arguments.length === 0) {
      throw new TypeError("Failed to execute 'observe' on 'ResizeObserver': 1 argument required, but only 0 present.");
    }
    if (!isElement(target)) {
      throw new TypeError("Failed to execute 'observe' on 'ResizeObserver': parameter 1 is not of type 'Element");
    }
    ResizeObserverController.observe(this, target, options);
  };
  ResizeObserver2.prototype.unobserve = function(target) {
    if (arguments.length === 0) {
      throw new TypeError("Failed to execute 'unobserve' on 'ResizeObserver': 1 argument required, but only 0 present.");
    }
    if (!isElement(target)) {
      throw new TypeError("Failed to execute 'unobserve' on 'ResizeObserver': parameter 1 is not of type 'Element");
    }
    ResizeObserverController.unobserve(this, target);
  };
  ResizeObserver2.prototype.disconnect = function() {
    ResizeObserverController.disconnect(this);
  };
  ResizeObserver2.toString = function() {
    return "function ResizeObserver () { [polyfill code] }";
  };
  return ResizeObserver2;
}();


;// CONCATENATED MODULE: ./node_modules/@juggle/resize-observer/lib/exports/resize-observer.js




;// CONCATENATED MODULE: ./src/characters/chisato.png
const chisato_namespaceObject = "data:image/png;base64,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";
;// CONCATENATED MODULE: ./src/characters/takina.png
const takina_namespaceObject = "data:image/png;base64,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";
;// CONCATENATED MODULE: ./src/characters/index.ts


const chisato = {
  image: chisato_namespaceObject,
  initialState: {
    i: 0.08,
    s: 0.1,
    d: 0.99,
    r: 1,
    y: 40,
    t: 0,
    w: 0
  }
};
const takina = {
  image: takina_namespaceObject,
  initialState: {
    i: 0.08,
    s: 0.1,
    d: 0.988,
    r: 12,
    y: 2,
    t: 0,
    w: 0
  }
};
/* harmony default export */ const characters = ({
  chisato,
  takina
});

;// CONCATENATED MODULE: ./src/icons/close.svg
const close_namespaceObject = "<svg xmlns=\"http://www.w3.org/2000/svg\" class=\"sakana-widget-icon\" viewBox=\"0 0 512 512\"><path d=\"M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192z\" fill=\"none\" stroke=\"currentColor\" stroke-miterlimit=\"10\" stroke-width=\"32\"/><path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"32\" d=\"M320 320 192 192m0 128 128-128\"/></svg>";
;// CONCATENATED MODULE: ./src/icons/github.svg
const github_namespaceObject = "<svg xmlns=\"http://www.w3.org/2000/svg\" class=\"sakana-widget-icon\" viewBox=\"0 0 512 512\"><path fill=\"currentColor\" d=\"M256 32C132.3 32 32 134.9 32 261.7c0 101.5 64.2 187.5 153.2 217.9a17.56 17.56 0 0 0 3.8.4c8.3 0 11.5-6.1 11.5-11.4 0-5.5-.2-19.9-.3-39.1a102.4 102.4 0 0 1-22.6 2.7c-43.1 0-52.9-33.5-52.9-33.5-10.2-26.5-24.9-33.6-24.9-33.6-19.5-13.7-.1-14.1 1.4-14.1h.1c22.5 2 34.3 23.8 34.3 23.8 11.2 19.6 26.2 25.1 39.6 25.1a63 63 0 0 0 25.6-6c2-14.8 7.8-24.9 14.2-30.7-49.7-5.8-102-25.5-102-113.5 0-25.1 8.7-45.6 23-61.6-2.3-5.8-10-29.2 2.2-60.8a18.64 18.64 0 0 1 5-.5c8.1 0 26.4 3.1 56.6 24.1a208.21 208.21 0 0 1 112.2 0c30.2-21 48.5-24.1 56.6-24.1a18.64 18.64 0 0 1 5 .5c12.2 31.6 4.5 55 2.2 60.8 14.3 16.1 23 36.6 23 61.6 0 88.2-52.4 107.6-102.3 113.3 8 7.1 15.2 21.1 15.2 42.5 0 30.7-.3 55.5-.3 63 0 5.4 3.1 11.5 11.4 11.5a19.35 19.35 0 0 0 4-.4C415.9 449.2 480 363.1 480 261.7 480 134.9 379.7 32 256 32z\"/></svg>";
;// CONCATENATED MODULE: ./src/icons/person.svg
const person_namespaceObject = "<svg xmlns=\"http://www.w3.org/2000/svg\" class=\"sakana-widget-icon\" viewBox=\"0 0 512 512\"><path fill=\"currentColor\" d=\"M258.9 48C141.92 46.42 46.42 141.92 48 258.9c1.56 112.19 92.91 203.54 205.1 205.1 117 1.6 212.48-93.9 210.88-210.88C462.44 140.91 371.09 49.56 258.9 48zm126.42 327.25a4 4 0 0 1-6.14-.32 124.27 124.27 0 0 0-32.35-29.59C321.37 329 289.11 320 256 320s-65.37 9-90.83 25.34a124.24 124.24 0 0 0-32.35 29.58 4 4 0 0 1-6.14.32A175.32 175.32 0 0 1 80 259c-1.63-97.31 78.22-178.76 175.57-179S432 158.81 432 256a175.32 175.32 0 0 1-46.68 119.25z\"/><path fill=\"currentColor\" d=\"M256 144c-19.72 0-37.55 7.39-50.22 20.82s-19 32-17.57 51.93C191.11 256 221.52 288 256 288s64.83-32 67.79-71.24c1.48-19.74-4.8-38.14-17.68-51.82C293.39 151.44 275.59 144 256 144z\"/></svg>";
;// CONCATENATED MODULE: ./src/icons/sync.svg
const sync_namespaceObject = "<svg xmlns=\"http://www.w3.org/2000/svg\" class=\"sakana-widget-icon\" viewBox=\"0 0 512 512\"><path d=\"M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192z\" fill=\"none\" stroke=\"currentColor\" stroke-miterlimit=\"10\" stroke-width=\"32\"/><path d=\"M351.82 271.87v-16A96.15 96.15 0 0 0 184.09 192m-24.2 48.17v16A96.22 96.22 0 0 0 327.81 320\" fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"32\"/><path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"32\" d=\"m135.87 256 23.59-23.6 24.67 23.6m192 0-23.59 23.6-24.67-23.6\"/></svg>";
;// CONCATENATED MODULE: ./src/icons/index.ts





;// CONCATENATED MODULE: ./src/utils.ts
function isObject(value) {
  const type = typeof value;
  return value != null && (type === "object" || type === "function");
}
function cloneDeep(value) {
  if (typeof window.structuredClone === "function") {
    return window.structuredClone(value);
  } else {
    return JSON.parse(JSON.stringify(value));
  }
}
function mergeDeep(target, source) {
  const _target = cloneDeep(target);
  const _source = cloneDeep(source);
  if (!isObject(_target) || !isObject(_source)) {
    return _target;
  }
  Object.keys(_source).forEach((key) => {
    if (isObject(_source[key])) {
      if (!isObject(_target[key])) {
        _target[key] = {};
      }
      _target[key] = mergeDeep(_target[key], _source[key]);
    } else {
      _target[key] = _source[key];
    }
  });
  return _target;
}
function throttle(callback) {
  let requestId = null;
  let lastArgs;
  const later = (context) => () => {
    requestId = null;
    callback.apply(context, lastArgs);
  };
  const throttled = function(...args) {
    lastArgs = args;
    if (requestId === null) {
      requestId = requestAnimationFrame(later(this));
    }
  };
  return throttled;
}
function getCanvasCtx(canvas, appSize, devicePixelRatio = (window.devicePixelRatio || 1) * 2) {
  const canvasRenderSize = appSize * devicePixelRatio;
  canvas.width = canvasRenderSize;
  canvas.height = canvasRenderSize;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return null;
  }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(devicePixelRatio, devicePixelRatio);
  return ctx;
}

;// CONCATENATED MODULE: ./src/index.ts
/*! sakana-widget | DSRKafuU (https://dsrkafuu.net) | Copyright (c) MIT License */





const defaultOptions = {
  size: 200,
  autoFit: false,
  character: "chisato",
  controls: true,
  stroke: {
    color: "#b4b4b4",
    width: 10
  },
  threshold: 0.1,
  rotate: 0
};
const _characters = {};
Object.keys(characters).forEach((key) => {
  const _char = characters[key];
  _characters[key] = cloneDeep(_char);
});
class SakanaWidget {
  constructor(options = {}) {
    this._lastRunUnix = Date.now();
    this._frameUnix = 1e3 / 60;
    this._running = true;
    this._magicForceTimeout = 0;
    this._magicForceEnabled = false;
    this._domEl = null;
    this._resizeObserver = null;
    this._options = cloneDeep(
      defaultOptions
    );
    this._options = mergeDeep(this._options, options);
    this.setCharacter(this._options.character);
    this._updateDom();
    this._updateSize(this._options.size);
    this._updateLimit(this._options.size);
    this._updateLimit = this._updateLimit.bind(this);
    this._updateSize = this._updateSize.bind(this);
    this._updateDom = this._updateDom.bind(this);
    this._calcCenterPoint = this._calcCenterPoint.bind(this);
    this._draw = this._draw.bind(this);
    this._run = this._run.bind(this);
    this._move = this._move.bind(this);
    this._onMouseDown = this._onMouseDown.bind(this);
    this._onTouchStart = this._onTouchStart.bind(this);
    this._magicForce = this._magicForce.bind(this);
    this.triggetAutoMode = this.triggetAutoMode.bind(this);
    this.setState = this.setState.bind(this);
    this.setCharacter = this.setCharacter.bind(this);
    this.nextCharacter = this.nextCharacter.bind(this);
    this._onResize = this._onResize.bind(this);
    this.mount = this.mount.bind(this);
    this.unmount = this.unmount.bind(this);
  }
  static getCharacter(name) {
    return _characters[name] || null;
  }
  static getCharacters() {
    return _characters;
  }
  static registerCharacter(name, character) {
    const _char = cloneDeep(character);
    let inertia = _char.initialState.i;
    inertia = Math.min(0.5, Math.max(0, inertia));
    _char.initialState.i = inertia;
    _characters[name] = _char;
  }
  _updateLimit(size) {
    let maxR = size / 5;
    if (maxR < 30) {
      maxR = 30;
    } else if (maxR > 60) {
      maxR = 60;
    }
    const maxY = size / 4;
    const minY = -maxY;
    this._limit = { maxR, maxY, minY };
  }
  _updateSize(size) {
    this._options.size = size;
    this._imageSize = this._options.size / 1.25;
    this._domApp.style.width = `${size}px`;
    this._domApp.style.height = `${size}px`;
    this._domCanvas.style.width = `${size}px`;
    this._domCanvas.style.height = `${size}px`;
    const ctx = getCanvasCtx(this._domCanvas, size);
    if (!ctx) {
      throw new Error("Invalid canvas context");
    }
    this._domCanvasCtx = ctx;
    this._draw();
    this._domMain.style.width = `${size}px`;
    this._domMain.style.height = `${size}px`;
    this._domImage.style.width = `${this._imageSize}px`;
    this._domImage.style.height = `${this._imageSize}px`;
    this._domImage.style.transformOrigin = `50% ${size}px`;
  }
  _updateDom() {
    const wrapper = document.createElement("div");
    wrapper.className = "sakana-widget-wrapper";
    this._domWrapper = wrapper;
    const app = document.createElement("div");
    app.className = "sakana-widget-app";
    this._domApp = app;
    wrapper.appendChild(app);
    const canvas = document.createElement("canvas");
    canvas.className = "sakana-widget-canvas";
    this._domCanvas = canvas;
    app.appendChild(canvas);
    const main = document.createElement("div");
    main.className = "sakana-widget-main";
    this._domMain = main;
    app.appendChild(main);
    const img = document.createElement("div");
    img.className = "sakana-widget-img";
    img.style.backgroundImage = `url('${this._image}')`;
    this._domImage = img;
    main.appendChild(img);
    const ctrl = document.createElement("div");
    ctrl.className = "sakana-widget-ctrl";
    this._domCtrl = ctrl;
    if (this._options.controls) {
      main.appendChild(ctrl);
    }
    const itemClass = "sakana-widget-ctrl-item";
    const person = document.createElement("div");
    person.className = itemClass;
    person.innerHTML = person_namespaceObject;
    this._domCtrlPerson = person;
    ctrl.appendChild(person);
    const magic = document.createElement("div");
    magic.className = itemClass;
    magic.innerHTML = sync_namespaceObject;
    this._domCtrlMagic = magic;
    ctrl.appendChild(magic);
    const github = document.createElement("a");
    github.className = itemClass;
    github.href = "//github.com/dsrkafuu/sakana-widget";
    github.target = "_blank";
    github.innerHTML = github_namespaceObject;
    this._domCtrlGitHub = github;
    ctrl.appendChild(github);
    const close = document.createElement("div");
    close.className = itemClass;
    close.innerHTML = close_namespaceObject;
    this._domCtrlClose = close;
    ctrl.appendChild(close);
  }
  _calcCenterPoint(degree, radius, x, y) {
    const radian = Math.PI / 180 * degree;
    const cos = Math.cos(radian);
    const sin = Math.sin(radian);
    const nx = sin * radius + cos * x - sin * y;
    const ny = cos * radius - cos * y - sin * x;
    return { nx, ny };
  }
  _draw() {
    const { r, y } = this._state;
    const { size, controls, stroke } = this._options;
    const img = this._domImage;
    const imgSize = this._imageSize;
    const ctx = this._domCanvasCtx;
    const x = r * 1;
    img.style.transform = `rotate(${r}deg) translateX(${x}px) translateY(${y}px)`;
    ctx.clearRect(0, 0, size, size);
    ctx.save();
    ctx.translate(size / 2, size);
    ctx.strokeStyle = stroke.color;
    ctx.lineWidth = stroke.width;
    ctx.lineCap = "round";
    ctx.beginPath();
    if (controls) {
      ctx.moveTo(0, -10);
    } else {
      ctx.moveTo(0, 10);
    }
    const radius = size - imgSize / 2;
    const { nx, ny } = this._calcCenterPoint(r, radius, x, y);
    ctx.lineTo(nx, -ny);
    ctx.stroke();
    ctx.restore();
  }
  _run() {
    let originRotate = this._options.rotate;
    originRotate = Math.min(120, Math.max(0, originRotate));
    const cut = this._options.threshold;
    if (!this._running) {
      return;
    }
    let { r, y, t, w } = this._state;
    const { d, i } = this._state;
    const thisRunUnix = Date.now();
    let _inertia = i;
    const lastRunUnixDiff = thisRunUnix - this._lastRunUnix;
    if (lastRunUnixDiff < 16) {
      _inertia = i / this._frameUnix * lastRunUnixDiff;
    }
    this._lastRunUnix = thisRunUnix;
    w = w - r * 2 - originRotate;
    r = r + w * _inertia * 1.2;
    this._state.w = w * d;
    this._state.r = r;
    t = t - y * 2;
    y = y + t * _inertia * 2;
    this._state.t = t * d;
    this._state.y = y;
    if (Math.max(
      Math.abs(this._state.w),
      Math.abs(this._state.r),
      Math.abs(this._state.t),
      Math.abs(this._state.y)
    ) < cut) {
      this._running = false;
      return;
    }
    this._draw();
    requestAnimationFrame(this._run);
  }
  _move(x, y) {
    const { maxR, maxY, minY } = this._limit;
    let r = x * this._state.s;
    r = Math.max(-maxR, r);
    r = Math.min(maxR, r);
    y = y * this._state.s * 2;
    y = Math.max(minY, y);
    y = Math.min(maxY, y);
    this._state.r = r;
    this._state.y = y;
    this._state.w = 0;
    this._state.t = 0;
    this._draw();
  }
  _onMouseDown(e) {
    e.preventDefault();
    this._running = false;
    const { pageY } = e;
    const _downPageY = pageY;
    this._state.w = 0;
    this._state.t = 0;
    const onMouseMove = (e2) => {
      const rect = this._domMain.getBoundingClientRect();
      const leftCenter = rect.left + rect.width / 2;
      const { pageX, pageY: pageY2 } = e2;
      const x = pageX - leftCenter;
      const y = pageY2 - _downPageY;
      this._move(x, y);
    };
    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      this._running = true;
      requestAnimationFrame(this._run);
    };
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  }
  _onTouchStart(e) {
    e.preventDefault();
    this._running = false;
    if (!e.touches[0]) {
      return;
    }
    const { pageY } = e.touches[0];
    const _downPageY = pageY;
    this._state.w = 0;
    this._state.t = 0;
    const onTouchMove = (e2) => {
      if (!e2.touches[0]) {
        return;
      }
      const rect = this._domMain.getBoundingClientRect();
      const leftCenter = rect.left + rect.width / 2;
      const { pageX, pageY: pageY2 } = e2.touches[0];
      const x = pageX - leftCenter;
      const y = pageY2 - _downPageY;
      this._move(x, y);
    };
    const onTouchEnd = () => {
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", onTouchEnd);
      this._running = true;
      requestAnimationFrame(this._run);
    };
    document.addEventListener("touchmove", onTouchMove);
    document.addEventListener("touchend", onTouchEnd);
  }
  _magicForce() {
    if (Math.random() < 0.1) {
      const available = Object.keys(_characters);
      const index = Math.floor(Math.random() * available.length);
      const _char = available[index];
      this.setCharacter(_char);
    } else {
      this._state.t = this._state.t + (Math.random() - 0.5) * 150;
      this._state.w = this._state.w + (Math.random() - 0.5) * 200;
    }
    if (!this._running) {
      this._running = true;
      requestAnimationFrame(this._run);
    }
    this._magicForceTimeout = window.setTimeout(
      this._magicForce,
      Math.random() * 3e3 + 2e3
    );
  }
  triggetAutoMode() {
    this._magicForceEnabled = !this._magicForceEnabled;
    const icon = this._domCtrlMagic.querySelector("svg");
    if (this._magicForceEnabled) {
      icon.classList.add("sakana-widget-icon--rotate");
    } else {
      icon.classList.remove("sakana-widget-icon--rotate");
    }
    clearTimeout(this._magicForceTimeout);
    if (this._magicForceEnabled) {
      this._magicForceTimeout = window.setTimeout(
        this._magicForce,
        Math.random() * 1e3 + 500
      );
    }
  }
  setState(state) {
    if (!this._state) {
      this._state = {};
    }
    this._state = mergeDeep(this._state, cloneDeep(state));
    return this;
  }
  setCharacter(name) {
    const targetChar = _characters[name];
    if (!targetChar) {
      throw new Error(`invalid character ${name}`);
    }
    this._char = name;
    this._image = targetChar.image;
    this.setState(targetChar.initialState);
    if (this._domImage) {
      this._domImage.style.backgroundImage = `url('${this._image}')`;
    }
    return this;
  }
  nextCharacter() {
    const _chars = Object.keys(SakanaWidget.getCharacters()).sort();
    const curCharIdx = _chars.indexOf(this._char);
    const nextCharIdx = (curCharIdx + 1) % _chars.length;
    const nextChar = _chars[nextCharIdx];
    this.setCharacter(nextChar);
    return this;
  }
  _onResize(rect) {
    let newSize = Math.min(rect.width, rect.height);
    newSize = Math.max(120, newSize);
    this._updateSize(newSize);
    this._updateLimit(newSize);
  }
  mount(el) {
    let _el = null;
    if (typeof el === "string") {
      _el = document.querySelector(el);
    }
    if (!_el) {
      throw new Error("Invalid mounting element");
    }
    this._domEl = _el;
    const parent = _el.parentNode;
    if (!parent) {
      throw new Error("Invalid mounting element parent");
    }
    this._domImage.addEventListener("mousedown", this._onMouseDown);
    this._domImage.addEventListener("touchstart", this._onTouchStart);
    this._domCtrlPerson.addEventListener("click", this.nextCharacter);
    this._domCtrlMagic.addEventListener("click", this.triggetAutoMode);
    this._domCtrlClose.addEventListener("click", this.unmount);
    if (this._options.autoFit) {
      this._onResize(this._domWrapper.getBoundingClientRect());
      this._resizeObserver = new ResizeObserver(
        throttle((entries) => {
          if (!entries || !entries[0])
            return;
          this._onResize(entries[0].contentRect);
        })
      );
      this._resizeObserver.observe(this._domWrapper);
    }
    const _newEl = _el.cloneNode(false);
    _newEl.appendChild(this._domWrapper);
    parent.replaceChild(_newEl, _el);
    requestAnimationFrame(this._run);
    return this;
  }
  unmount() {
    this._domImage.removeEventListener("mousedown", this._onMouseDown);
    this._domImage.removeEventListener("touchstart", this._onTouchStart);
    this._domCtrlPerson.removeEventListener("click", this.nextCharacter);
    this._domCtrlMagic.removeEventListener("click", this.triggetAutoMode);
    this._domCtrlClose.removeEventListener("click", this.unmount);
    this._resizeObserver && this._resizeObserver.disconnect();
    const _el = this._domWrapper.parentNode;
    if (!_el) {
      throw new Error("Invalid mounting element");
    }
    _el.removeChild(this._domWrapper);
    return this;
  }
}
/* harmony default export */ const src_0 = (SakanaWidget);

})();

var __webpack_exports__default = __webpack_exports__.Z;
export { __webpack_exports__default as default };
