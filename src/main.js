"use strict";

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
	}
	
	onSelectText() {
		this.currentSelection = window.getSelection();
		var rect = this.currentSelection.getRangeAt(0).getBoundingClientRect();
		this.airPopUp.setPosition(rect.left, rect.top);
	}
	
	onSelectStart() {
		this.airPopUp.hide();
	}
}

class GuacaAirPopUp {
	
	constructor(editorElement, settings) {		
		this.airPopUp = $('<div></div>');
		this.airPopUp.addClass("guaca-airpopup");
		this.addControls(settings || this.getControls(), this.airPopUp);
		this.airPopUp.insertAfter(editorElement);
	}
	
	// API Start
	
	setPosition(x, y) {
		this.airPopUp.css("top", y);
		this.airPopUp.css("left", x);
		this.airPopUp.css("display", "block");
	}
	
	hide() {
		this.airPopUp.css("display", "none");
	}
	
	// API End
	
	addControls(controls, element) {
		for(var control of controls) {
			if(typeof control == "object" && control.length) {
				var container = this.createControl("container");
				this.addControls(control, container);
				element.append(container);
			}
			element.append(this.createControl(control));
		}
	}
	
	createControl(className) {
		var control = $('<span></span>');
		control.addClass(className);
		return control;
	}
	
	getControls() {
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
}