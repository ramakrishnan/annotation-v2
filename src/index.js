let xpathRange = require('xpath-range');

require('./styles/annotator.scss');
import textSelector from './services/textSelector.js';
import adderService from './adder/service';
import highlightService from './highlight/service';

class Annotation {
    constructor(element) {
        this.element = element;
        this.element.addEventListener('mouseup', (e) => {
            this.checkForEndSelection(e);
        });
        textSelector.rootElement = element;
    }

    init() {
        adderService.inject();
        highlightService.inject();
    }

    checkForEndSelection(event) {
        let selection = window.getSelection();
        if (selection.isCollapsed === false && adderService.isVisible === false) {
            let position = textSelector.getMousePosition(event)
            adderService.show(position);
            highlightService.hide();
        } else {
            adderService.hide();
        }
    }
}
module.exports = Annotation;
