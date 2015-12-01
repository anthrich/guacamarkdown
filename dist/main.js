"use strict";

var GuacaMarkdownEditor = (function () {
	function GuacaMarkdownEditor(inputElement) {
		babelHelpers.classCallCheck(this, GuacaMarkdownEditor);

		var self = this;
		self.inputElement = inputElement;
		self.guacaEditorElement = this.setUpGuacaMarkdownElement();
		self.airPopUp = new GuacaAirPopUp(self.guacaEditorElement);
		self.currentSelection = null;

		inputElement.css("display", "none");
		self.subscribeToEvents();
	}

	babelHelpers.createClass(GuacaMarkdownEditor, [{
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

var GuacaAirPopUp = (function () {
	function GuacaAirPopUp(editorElement, settings) {
		babelHelpers.classCallCheck(this, GuacaAirPopUp);

		this.settings = settings || this.getDefaultSettings();
		this.airPopUp = $('<div></div>');
		this.airPopUp.addClass("guaca-airpopup");
		this.addControls(this.settings.controls, this.airPopUp);
		this.airPopUp.insertAfter(editorElement);
		this.$window = $(window);
	}

	// API Start

	babelHelpers.createClass(GuacaAirPopUp, [{
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

					if ((typeof control === "undefined" ? "undefined" : babelHelpers.typeof(control)) == "object" && control.length) {
						var container = this.createControl("container");
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
			var control = $('<span></span>');
			control.addClass(className);
			return control;
		}
	}, {
		key: "getControls",
		value: function getControls() {
			return ['bold', 'italic', 'divider', ['small-heading', 'medium-heading', 'large-heading'], 'paragraph', 'ol', 'ul', 'code'];
		}
	}, {
		key: "getDefaultSettings",
		value: function getDefaultSettings() {
			return {
				"y-spacing": 8,
				"x-spacing": 20,
				"controls": this.getControls()
			};
		}
	}]);
	return GuacaAirPopUp;
})();