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
		}
	}, {
		key: "onSelectText",
		value: function onSelectText() {
			this.currentSelection = window.getSelection();
			var rect = this.currentSelection.getRangeAt(0).getBoundingClientRect();
			this.airPopUp.setPosition(rect.left, rect.top);
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

		this.airPopUp = $('<div></div>');
		this.airPopUp.addClass("guaca-airpopup");
		this.addControls(settings || this.getControls(), this.airPopUp);
		this.airPopUp.insertAfter(editorElement);
	}

	// API Start

	babelHelpers.createClass(GuacaAirPopUp, [{
		key: "setPosition",
		value: function setPosition(x, y) {
			this.airPopUp.css("top", y);
			this.airPopUp.css("left", x);
			this.airPopUp.css("display", "block");
		}
	}, {
		key: "hide",
		value: function hide() {
			this.airPopUp.css("display", "none");
		}

		// API End

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
	}]);
	return GuacaAirPopUp;
})();