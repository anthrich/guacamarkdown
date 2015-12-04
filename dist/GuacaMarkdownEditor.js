/* global $ */

class GuacaAirPopUp {
	
	constructor(editorElement, controlHandlerService, settings) {
		this.settings = settings || this.getDefaultSettings();
		this.controlHandlerService = controlHandlerService;	
		this.airPopUp = $('<div></div>');
		this.airPopUp.addClass("guaca-airpopup");
		this.airPopUp.insertAfter(editorElement);
		this.addControls(this.settings.controls, this.airPopUp);
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
		var self = this;
		for(var control of controls) {
			if(typeof control == "object" && control.length) {
				var container =  $('<span class="container"></span>');
				this.addControls(control, container);
				element.append(container);
			}
			var controlElem = this.createControl(control);
			element.append(controlElem);
			var controlHandler = this.controlHandlerService.getHandler(control);
			if(controlHandler) {
				controlElem.on("click", function() {
					var controlAlias = $(this).attr("control-alias");
					var controlHandler = self.controlHandlerService.getHandler(controlAlias);
					controlHandler.execute();
				});	
			}
		}
	}
	
	createControl(className) {
		var control = $('<button></button>');
		control.addClass("guaca-control");
		control.addClass(className);
		control.attr("control-alias", className);
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

class BaseHandler {
	constructor() {
		this.markdownEditor = null;
	}
	
	registerMarkdownEditor(markdownEditor) {
		this.markdownEditor = markdownEditor;
	}
	
	getCurrentSelection() {
		if(this.markdownEditor) {
			return this.markdownEditor.getCurrentSelection();
		}
		throw "registerMarkdownEditor must be called before calling getCurrentSelection.";
	}
	
	execute() {
		throw "Must override the execute method in " + (typeof this);
	}
}

class ControlHandlerService {
	
	constructor() {
		this.registeredHandlers = [];
	}
	
	registerHandler(alias, handler) {
		var isControllerInstance = handler instanceof BaseHandler;
		if(!isControllerInstance) throw "ControlHandlerService.registerHandler can only register BaseHandler extensions"
		var existingHandlerReg = this.registeredHandlers.find(h => h.handler === handler);
		if(existingHandlerReg) {
			existingHandlerReg.aliases.push(alias);
			return;
		}
		
		this.registeredHandlers.push({
			aliases: [
				alias
			],
			handler: handler
		});
	}
	
	getHandler(alias) {
		var handlerRegistration = 
			this.registeredHandlers.find(h => h.aliases.some(a => a === alias));
		if(handlerRegistration)	return handlerRegistration.handler;
		else return null;
	}
}

const SelectionStatusEnum = {
	EXCLUSIVE_WHOLE_SELECTION_APPLIED: 0,
	WHOLE_SELECTION_APPLIED: 1,
	PARTIAL_SELECTION_MISSING: 2
}

class BoldMarkdownHandler extends BaseHandler {
	
	constructor() {
		super();
		this.elementType = "b";
	}
	
	execute() {
		document.execCommand("Bold", false, null);
		//var currentSelection = this.getCurrentSelection();
		//if (!currentSelection || currentSelection.rangeCount < 1) return;
		//var selectionState = this.detectSelectionState(currentSelection);
		//var boldEle = document.createElement(this.elementType);
		//currentSelection.getRangeAt(0).surroundContents(boldEle);
	}
	
	detectSelectionState(currentSelection) {
		var range = currentSelection.getRangeAt(0);
		var fragment = range.cloneContents();
		var div = document.createElement("div")
		div.appendChild(fragment.cloneNode(true));
		var fragmentHtml = div.innerHTML;
		var commonAncestorTagName = range.commonAncestorContainer.tagName;
		commonAncestorTagName = commonAncestorTagName ? commonAncestorTagName.toLowerCase() : "";
		var commonAncestorIsHandlerElement = commonAncestorTagName === this.elementType;

		if (commonAncestorIsHandlerElement && fragmentHtml === range.commonAncestorContainer.innerHtml) {
			return SelectionStatusEnum.EXCLUSIVE_WHOLE_SELECTION_APPLIED;
		} else if (commonAncestorIsHandlerElement) {
			return SelectionStatusEnum.WHOLE_SELECTION_APPLIED;
		} else {
			return SelectionStatusEnum.PARTIAL_SELECTION_MISSING;
		}
	}
}

var DefaultHandlerConfig = [
	{
		alias: "bold",
		handlerClass: BoldMarkdownHandler
	}
]

class GuacaMarkdownEditor {
	
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

export default GuacaMarkdownEditor;
//# sourceMappingURL=GuacaMarkdownEditor.js.map
