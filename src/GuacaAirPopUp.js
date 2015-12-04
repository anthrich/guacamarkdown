/* global $ */

export default class GuacaAirPopUp {
	
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