"use strict";

/* global $ */

import GuacaAirPopUp from './GuacaAirPopUp';

export default class GuacaMarkdownEditor {
	
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

