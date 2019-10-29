/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/backend/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/backend/index.ts":
/*!******************************!*\
  !*** ./src/backend/index.ts ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar tslib_1 = __webpack_require__(/*! tslib */ \"tslib\");\n\nvar process_1 = tslib_1.__importDefault(__webpack_require__(/*! process */ \"process\"));\n\nvar server_1 = tslib_1.__importDefault(__webpack_require__(/*! ./server */ \"./src/backend/server.ts\"));\n\nvar server = new server_1[\"default\"](__dirname);\nconsole.log(\"Server resources: \".concat(server.resources));\nserver.startServer();\n\nfunction onExit() {\n  server.stopServer();\n  console.log('Programm exiting...');\n}\n\nprocess_1[\"default\"].on('exit', onExit);\n\nfunction signalRecieved() {\n  process_1[\"default\"].exit(0);\n}\n\nprocess_1[\"default\"].on('SIGINT', signalRecieved);\nprocess_1[\"default\"].on('SIGHUP', signalRecieved);\nprocess_1[\"default\"].on('SIGTERM', signalRecieved);\n\n//# sourceURL=webpack:///./src/backend/index.ts?");

/***/ }),

/***/ "./src/backend/server.ts":
/*!*******************************!*\
  !*** ./src/backend/server.ts ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nfunction _typeof(obj) { if (typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; }; } return _typeof(obj); }\n\nfunction _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }\n\nfunction _nonIterableRest() { throw new TypeError(\"Invalid attempt to destructure non-iterable instance\"); }\n\nfunction _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === \"[object Arguments]\")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i[\"return\"] != null) _i[\"return\"](); } finally { if (_d) throw _e; } } return _arr; }\n\nfunction _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\nfunction _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === \"object\" || typeof call === \"function\")) { return call; } return _assertThisInitialized(self); }\n\nfunction _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return self; }\n\nfunction _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }\n\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function\"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }\n\nfunction _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar tslib_1 = __webpack_require__(/*! tslib */ \"tslib\");\n\nvar express_1 = tslib_1.__importDefault(__webpack_require__(/*! express */ \"express\"));\n\nvar express_ws_1 = tslib_1.__importDefault(__webpack_require__(/*! express-ws */ \"express-ws\"));\n\nvar events_1 = __webpack_require__(/*! events */ \"events\");\n\nvar path_1 = tslib_1.__importDefault(__webpack_require__(/*! path */ \"path\"));\n\nvar _ = tslib_1.__importStar(__webpack_require__(/*! lodash */ \"lodash\"));\n\nvar errors_1 = __webpack_require__(/*! ./utils/errors */ \"./src/backend/utils/errors.ts\");\n\nfunction _redirectDashboard(req, res) {\n  res.redirect('/dashboard');\n}\n\nvar FILE_MAPPINGS = {\n  '/dashboard': 'view.html',\n  '/frontend.js': 'frontend.js'\n};\n\nvar Server =\n/*#__PURE__*/\nfunction (_events_1$EventEmitte) {\n  _inherits(Server, _events_1$EventEmitte);\n\n  function Server(resourcePath) {\n    var _this;\n\n    _classCallCheck(this, Server);\n\n    _this = _possibleConstructorReturn(this, _getPrototypeOf(Server).call(this));\n    _this._open = false;\n    _this._expApp = express_1[\"default\"]();\n    _this._expWs = express_ws_1[\"default\"](_this._expApp);\n    _this._resourcePath = path_1[\"default\"].resolve(resourcePath);\n\n    var _loop = function _loop() {\n      var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),\n          route = _Object$entries$_i[0],\n          file = _Object$entries$_i[1];\n\n      _this._expApp.get(route, function (req, res) {\n        return res.sendFile(path_1[\"default\"].join(_this._resourcePath, file));\n      });\n    };\n\n    for (var _i = 0, _Object$entries = Object.entries(FILE_MAPPINGS); _i < _Object$entries.length; _i++) {\n      _loop();\n    }\n\n    _this._expApp.use(_redirectDashboard);\n\n    return _this;\n  }\n\n  _createClass(Server, [{\n    key: \"startServer\",\n    value: function startServer() {\n      var _this2 = this;\n\n      var port = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 8880;\n\n      if (this.serverOpen) {\n        throw new errors_1.StateException('Server already open');\n      }\n\n      if (_.isNil(this._server)) {\n        this._server = this._expApp.listen(port);\n      } else {\n        this._server.listen(port);\n      }\n\n      this._server.once('listening', function () {\n        _this2._open = true;\n      });\n\n      console.log(\"Server lisening on port '\".concat(port, \"'\"));\n      this.emit('started', port);\n    }\n  }, {\n    key: \"stopServer\",\n    value: function stopServer() {\n      var _this3 = this;\n\n      if (this.serverOpen) {\n        this._server.close(function () {\n          _this3._open = false;\n        });\n      }\n    }\n  }, {\n    key: \"serverOpen\",\n    get: function get() {\n      return this._open && !_.isNil(this._server);\n    }\n  }, {\n    key: \"resources\",\n    get: function get() {\n      return this._resourcePath;\n    }\n  }]);\n\n  return Server;\n}(events_1.EventEmitter);\n\nexports[\"default\"] = Server;\n\n//# sourceURL=webpack:///./src/backend/server.ts?");

/***/ }),

/***/ "./src/backend/utils/errors.ts":
/*!*************************************!*\
  !*** ./src/backend/utils/errors.ts ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nfunction _typeof(obj) { if (typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; }; } return _typeof(obj); }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === \"object\" || typeof call === \"function\")) { return call; } return _assertThisInitialized(self); }\n\nfunction _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return self; }\n\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function\"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }\n\nfunction _wrapNativeSuper(Class) { var _cache = typeof Map === \"function\" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== \"function\") { throw new TypeError(\"Super expression must either be null or a function\"); } if (typeof _cache !== \"undefined\") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }\n\nfunction isNativeReflectConstruct() { if (typeof Reflect === \"undefined\" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === \"function\") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }\n\nfunction _construct(Parent, args, Class) { if (isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }\n\nfunction _isNativeFunction(fn) { return Function.toString.call(fn).indexOf(\"[native code]\") !== -1; }\n\nfunction _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }\n\nfunction _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar StateException =\n/*#__PURE__*/\nfunction (_Error) {\n  _inherits(StateException, _Error);\n\n  function StateException(message) {\n    _classCallCheck(this, StateException);\n\n    return _possibleConstructorReturn(this, _getPrototypeOf(StateException).call(this, message));\n  }\n\n  return StateException;\n}(_wrapNativeSuper(Error));\n\nexports.StateException = StateException;\n\n//# sourceURL=webpack:///./src/backend/utils/errors.ts?");

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"events\");\n\n//# sourceURL=webpack:///external_%22events%22?");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"express\");\n\n//# sourceURL=webpack:///external_%22express%22?");

/***/ }),

/***/ "express-ws":
/*!*****************************!*\
  !*** external "express-ws" ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"express-ws\");\n\n//# sourceURL=webpack:///external_%22express-ws%22?");

/***/ }),

/***/ "lodash":
/*!*************************!*\
  !*** external "lodash" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"lodash\");\n\n//# sourceURL=webpack:///external_%22lodash%22?");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"path\");\n\n//# sourceURL=webpack:///external_%22path%22?");

/***/ }),

/***/ "process":
/*!**************************!*\
  !*** external "process" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"process\");\n\n//# sourceURL=webpack:///external_%22process%22?");

/***/ }),

/***/ "tslib":
/*!************************!*\
  !*** external "tslib" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"tslib\");\n\n//# sourceURL=webpack:///external_%22tslib%22?");

/***/ })

/******/ });