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
