/* global $ */

class GuacaAirPopUp {
	
	constructor(editorElement, settings) {
		this.settings = settings || this.getDefaultSettings();		
		this.airPopUp = $('<div></div>');
		this.airPopUp.addClass("guaca-airpopup");
		this.addControls(this.settings.controls, this.airPopUp);
		this.airPopUp.insertAfter(editorElement);
		this.$window = $(window);
	}
	
	// API Start
	
	setPosition(rect) {
		var y = this.getComputedYPosition(rect.top, rect.bottom),
			x = this.getComputedXPosition(rect.left);
			
		this.airPopUp.css("top", y);
		this.airPopUp.css("left", x);
		this.airPopUp.css("display", "block");
	}
	
	hide() {
		this.airPopUp.css("display", "none");
	}
	
	getHeight() {
		return this.airPopUp.innerHeight();
	}
	
	getWidth() {
		return this.airPopUp.innerWidth();
	}
	
	// API End
	
	getComputedYPosition(top, bottom) {
		var newYOffset = this.getHeight() + this.settings["y-spacing"];
		var y;
		if (top < newYOffset) y = bottom + this.settings["y-spacing"];
		else y = top - newYOffset;
		return y + this.$window.scrollTop();
	}
	
	getComputedXPosition(left) {
		var x = left;
		if (left + this.getWidth() + this.settings["x-spacing"] > this.$window.innerWidth()) 
			x = this.$window.innerWidth() - this.getWidth() - this.settings["x-spacing"];
		return x + this.$window.scrollLeft();
	}
	
	addControls(controls, element) {
		for(var control of controls) {
			if(typeof control == "object" && control.length) {
				var container =  $('<span class="container"></button>');
				this.addControls(control, container);
				element.append(container);
			}
			element.append(this.createControl(control));
		}
	}
	
	createControl(className) {
		var control = $('<button></button>');
		control.addClass(className);
		return control;
	}
	
	getDefaultControls() {
		return [
			'bold',
			'italic',
			'divider',
			[
				'small-heading',
				'medium-heading',
				'large-heading'
			],
			'paragraph',
			'ol',
			'ul',
			'code'
		];
	}
	
	getDefaultSettings() {
		return {
			"y-spacing": 8,
			"x-spacing": 20,
			"controls": this.getDefaultControls()
		}
	}
}

class GuacaMarkdownEditor {
	
	constructor(inputElement) {
		var self = this;
		self.inputElement = inputElement;
		self.guacaEditorElement = this.setUpGuacaMarkdownElement();
		self.airPopUp = new GuacaAirPopUp(self.guacaEditorElement);
		self.currentSelection = null;
		
		inputElement.css("display", "none");
		self.subscribeToEvents();
		
	}
	
	// API Start 
	
	getCurrentSelection() {
		return this.currentSelection;
	}
	
	// API End
	
	setUpGuacaMarkdownElement() {
		var guacaElement = $('<div contentEditable="true" class="guaca-editor" ></div>');
		var attributes = this.inputElement.prop("attributes");
		
		$.each(attributes, (i, a) => {
			guacaElement.attr(a.name, a.value);
		});
		
		guacaElement.css("display", "inline-block");
		guacaElement.addClass("guaca-editor");
		
		guacaElement.insertAfter(this.inputElement);
		
		return guacaElement;
	}
	
	subscribeToEvents() {
		var self = this;
		this.guacaEditorElement.on('selectstart', () => {
			self.onSelectStart();
			$(document).one('mouseup', () => {
				self.onSelectText();
			});
		});
		this.guacaEditorElement.on('blur', () => {
			self.airPopUp.hide();
		});
	}
	
	onSelectText() {
		this.currentSelection = window.getSelection();
		if(this.currentSelection.type === "Caret") return;
		var rect = this.currentSelection.getRangeAt(0).getBoundingClientRect();
		this.airPopUp.setPosition(rect);
	}
	
	onSelectStart() {
		this.airPopUp.hide();
	}
}

export default GuacaMarkdownEditor;
//# sourceMappingURL=GuacaMarkdownEditor.js.map
