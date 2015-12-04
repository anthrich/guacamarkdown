import BaseHandler from './handlers/BaseHandler';

export default class ControlHandlerService {
	
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