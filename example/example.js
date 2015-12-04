(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
	value: true
});

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* global $ */

var GuacaAirPopUp = (function () {
	function GuacaAirPopUp(editorElement, controlHandlerService, settings) {
		_classCallCheck(this, GuacaAirPopUp);

		this.settings = settings || this.getDefaultSettings();
		this.controlHandlerService = controlHandlerService;
		this.airPopUp = $('<div></div>');
		this.airPopUp.addClass("guaca-airpopup");
		this.airPopUp.insertAfter(editorElement);
		this.addControls(this.settings.controls, this.airPopUp);
		this.$window = $(window);
	}

	// API Start

	_createClass(GuacaAirPopUp, [{
		key: "setPosition",
		value: function setPosition(rect) {
			var y = this.getComputedYPosition(rect.top, rect.bottom),
			    x = this.getComputedXPosition(rect.left);

			this.airPopUp.css("top", y);
			this.airPopUp.css("left", x);
			this.airPopUp.css("display", "block");
		}
	}, {
		key: "hide",
		value: function hide() {
			this.airPopUp.css("display", "none");
		}
	}, {
		key: "getHeight",
		value: function getHeight() {
			return this.airPopUp.innerHeight();
		}
	}, {
		key: "getWidth",
		value: function getWidth() {
			return this.airPopUp.innerWidth();
		}

		// API End

	}, {
		key: "getComputedYPosition",
		value: function getComputedYPosition(top, bottom) {
			var newYOffset = this.getHeight() + this.settings["y-spacing"];
			var y;
			if (top < newYOffset) y = bottom + this.settings["y-spacing"];else y = top - newYOffset;
			return y + this.$window.scrollTop();
		}
	}, {
		key: "getComputedXPosition",
		value: function getComputedXPosition(left) {
			var x = left;
			if (left + this.getWidth() + this.settings["x-spacing"] > this.$window.innerWidth()) x = this.$window.innerWidth() - this.getWidth() - this.settings["x-spacing"];
			return x + this.$window.scrollLeft();
		}
	}, {
		key: "addControls",
		value: function addControls(controls, element) {
			var self = this;
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = controls[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var control = _step.value;

					if ((typeof control === "undefined" ? "undefined" : _typeof(control)) == "object" && control.length) {
						var container = $('<span class="container"></span>');
						this.addControls(control, container);
						element.append(container);
					}
					var controlElem = this.createControl(control);
					element.append(controlElem);
					var controlHandler = this.controlHandlerService.getHandler(control);
					if (controlHandler) {
						controlElem.on("click", function () {
							var controlAlias = $(this).attr("control-alias");
							var controlHandler = self.controlHandlerService.getHandler(controlAlias);
							controlHandler.execute();
						});
					}
				}
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator.return) {
						_iterator.return();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}
		}
	}, {
		key: "createControl",
		value: function createControl(className) {
			var control = $('<button></button>');
			control.addClass("guaca-control");
			control.addClass(className);
			control.attr("control-alias", className);
			return control;
		}
	}, {
		key: "getDefaultControls",
		value: function getDefaultControls() {
			return ['bold', 'italic', 'divider', ['small-heading', 'medium-heading', 'large-heading'], 'paragraph', 'ol', 'ul', 'code'];
		}
	}, {
		key: "getDefaultSettings",
		value: function getDefaultSettings() {
			return {
				"y-spacing": 8,
				"x-spacing": 20,
				"controls": this.getDefaultControls()
			};
		}
	}]);

	return GuacaAirPopUp;
})();

var BaseHandler = (function () {
	function BaseHandler() {
		_classCallCheck(this, BaseHandler);

		this.markdownEditor = null;
	}

	_createClass(BaseHandler, [{
		key: "registerMarkdownEditor",
		value: function registerMarkdownEditor(markdownEditor) {
			this.markdownEditor = markdownEditor;
		}
	}, {
		key: "getCurrentSelection",
		value: function getCurrentSelection() {
			if (this.markdownEditor) {
				return this.markdownEditor.getCurrentSelection();
			}
			throw "registerMarkdownEditor must be called before calling getCurrentSelection.";
		}
	}, {
		key: "execute",
		value: function execute() {
			throw "Must override the execute method in " + _typeof(this);
		}
	}]);

	return BaseHandler;
})();

var ControlHandlerService = (function () {
	function ControlHandlerService() {
		_classCallCheck(this, ControlHandlerService);

		this.registeredHandlers = [];
	}

	_createClass(ControlHandlerService, [{
		key: "registerHandler",
		value: function registerHandler(alias, handler) {
			var isControllerInstance = handler instanceof BaseHandler;
			if (!isControllerInstance) throw "ControlHandlerService.registerHandler can only register BaseHandler extensions";
			var existingHandlerReg = this.registeredHandlers.find(function (h) {
				return h.handler === handler;
			});
			if (existingHandlerReg) {
				existingHandlerReg.aliases.push(alias);
				return;
			}

			this.registeredHandlers.push({
				aliases: [alias],
				handler: handler
			});
		}
	}, {
		key: "getHandler",
		value: function getHandler(alias) {
			var handlerRegistration = this.registeredHandlers.find(function (h) {
				return h.aliases.some(function (a) {
					return a === alias;
				});
			});
			if (handlerRegistration) return handlerRegistration.handler;else return null;
		}
	}]);

	return ControlHandlerService;
})();

var BoldMarkdownHandler = (function (_BaseHandler) {
	_inherits(BoldMarkdownHandler, _BaseHandler);

	function BoldMarkdownHandler() {
		_classCallCheck(this, BoldMarkdownHandler);

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(BoldMarkdownHandler).call(this));

		_this.elementType = "b";
		return _this;
	}

	_createClass(BoldMarkdownHandler, [{
		key: "execute",
		value: function execute() {
			document.execCommand("Bold", false, null);
		}
	}]);

	return BoldMarkdownHandler;
})(BaseHandler);

var DefaultHandlerConfig = [{
	alias: "bold",
	handlerClass: BoldMarkdownHandler
}];

var GuacaMarkdownEditor = (function () {
	function GuacaMarkdownEditor(inputElement) {
		_classCallCheck(this, GuacaMarkdownEditor);

		var self = this;
		self.inputElement = inputElement;
		self.guacaEditorElement = this.setUpGuacaMarkdownElement();
		self.controlHandlerService = this.setUpControlHandlerService();
		self.airPopUp = new GuacaAirPopUp(self.guacaEditorElement, self.controlHandlerService);
		self.currentSelection = null;

		inputElement.css("display", "none");
		self.subscribeToEvents();
	}

	// API Start

	_createClass(GuacaMarkdownEditor, [{
		key: "getCurrentSelection",
		value: function getCurrentSelection() {
			return this.currentSelection;
		}

		// API End

	}, {
		key: "setUpGuacaMarkdownElement",
		value: function setUpGuacaMarkdownElement() {
			var guacaElement = $('<div contentEditable="true" class="guaca-editor" ></div>');
			var attributes = this.inputElement.prop("attributes");

			$.each(attributes, function (i, a) {
				guacaElement.attr(a.name, a.value);
			});

			guacaElement.css("display", "inline-block");
			guacaElement.addClass("guaca-editor");

			guacaElement.insertAfter(this.inputElement);

			return guacaElement;
		}
	}, {
		key: "setUpControlHandlerService",
		value: function setUpControlHandlerService() {
			var controlHandlerService = new ControlHandlerService();
			var _iteratorNormalCompletion2 = true;
			var _didIteratorError2 = false;
			var _iteratorError2 = undefined;

			try {
				for (var _iterator2 = DefaultHandlerConfig[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
					var handler = _step2.value;

					var HandlerClass = handler.handlerClass;
					var handlerInstance = new HandlerClass();
					handlerInstance.registerMarkdownEditor(this);
					controlHandlerService.registerHandler(handler.alias, handlerInstance);
				}
			} catch (err) {
				_didIteratorError2 = true;
				_iteratorError2 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion2 && _iterator2.return) {
						_iterator2.return();
					}
				} finally {
					if (_didIteratorError2) {
						throw _iteratorError2;
					}
				}
			}

			return controlHandlerService;
		}
	}, {
		key: "subscribeToEvents",
		value: function subscribeToEvents() {
			var self = this;
			this.guacaEditorElement.on('selectstart', function () {
				self.onSelectStart();
				$(document).one('mouseup', function () {
					self.onSelectText();
				});
			});
			this.guacaEditorElement.on('blur', function (event) {
				if (event.relatedTarget && $(event.relatedTarget).hasClass("guaca-control")) return true;else self.airPopUp.hide();
			});
		}
	}, {
		key: "onSelectText",
		value: function onSelectText() {
			this.currentSelection = window.getSelection();
			if (this.currentSelection.type === "Caret") return;
			var rect = this.currentSelection.getRangeAt(0).getBoundingClientRect();
			this.airPopUp.setPosition(rect);
		}
	}, {
		key: "onSelectStart",
		value: function onSelectStart() {
			this.airPopUp.hide();
		}
	}]);

	return GuacaMarkdownEditor;
})();

exports.default = GuacaMarkdownEditor;


},{}],2:[function(require,module,exports){
"use strict";

var _GuacaMarkdownEditor = require("../dist/GuacaMarkdownEditor");

var _GuacaMarkdownEditor2 = _interopRequireDefault(_GuacaMarkdownEditor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Testing
var editor = new _GuacaMarkdownEditor2.default($(".editorinput"));

},{"../dist/GuacaMarkdownEditor":1}]},{},[2])


//# sourceMappingURL=example.js.map
