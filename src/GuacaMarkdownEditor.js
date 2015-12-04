"use strict";

/* global $ */

import GuacaAirPopUp from './GuacaAirPopUp';
import ControlHandlerService from './ControlHandlerService';
import DefaultHandlerConfig from './DefaultHandlerConfig';

export default class GuacaMarkdownEditor {
	
	constructor(inputElement) {
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
	
	setUpControlHandlerService() {
		var controlHandlerService = new ControlHandlerService();
		for(var handler of DefaultHandlerConfig)
		{
			var HandlerClass = handler.handlerClass;
			var handlerInstance = new HandlerClass();
			handlerInstance.registerMarkdownEditor(this);
			controlHandlerService.registerHandler(handler.alias, handlerInstance);
		}
		
		return controlHandlerService;
	}
	
	subscribeToEvents() {
		var self = this;
		this.guacaEditorElement.on('selectstart', () => {
			self.onSelectStart();
			$(document).one('mouseup', () => {
				self.onSelectText();
			});
		});
		this.guacaEditorElement.on('blur', (event) => {
			if(event.relatedTarget && $(event.relatedTarget).hasClass("guaca-control"))
				return true;
			else
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

