export default class BaseHandler {
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