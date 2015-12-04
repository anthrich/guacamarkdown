import BaseHandler from './BaseHandler';

export default class BoldMarkdownHandler extends BaseHandler {
	
	constructor() {
		super();
		this.elementType = "b";
	}
	
	execute() {
		document.execCommand("Bold", false, null);
	}
}

