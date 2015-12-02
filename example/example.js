(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
	value: true
});

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* global $ */

var GuacaAirPopUp = (function () {
	function GuacaAirPopUp(editorElement, settings) {
		_classCallCheck(this, GuacaAirPopUp);

		this.settings = settings || this.getDefaultSettings();
		this.airPopUp = $('<div></div>');
		this.airPopUp.addClass("guaca-airpopup");
		this.addControls(this.settings.controls, this.airPopUp);
		this.airPopUp.insertAfter(editorElement);
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
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = controls[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var control = _step.value;

					if ((typeof control === "undefined" ? "undefined" : _typeof(control)) == "object" && control.length) {
						var container = $('<span class="container"></button>');
						this.addControls(control, container);
						element.append(container);
					}
					element.append(this.createControl(control));
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
			control.addClass(className);
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

var GuacaMarkdownEditor = (function () {
	function GuacaMarkdownEditor(inputElement) {
		_classCallCheck(this, GuacaMarkdownEditor);

		var self = this;
		self.inputElement = inputElement;
		self.guacaEditorElement = this.setUpGuacaMarkdownElement();
		self.airPopUp = new GuacaAirPopUp(self.guacaEditorElement);
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
		key: "subscribeToEvents",
		value: function subscribeToEvents() {
			var self = this;
			this.guacaEditorElement.on('selectstart', function () {
				self.onSelectStart();
				$(document).one('mouseup', function () {
					self.onSelectText();
				});
			});
			this.guacaEditorElement.on('blur', function () {
				self.airPopUp.hide();
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
