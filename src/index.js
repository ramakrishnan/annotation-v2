let xpathRange = require('xpath-range');

require('./styles/annotator.scss');
import textSelector from './services/textSelector.js';
import adderService from './adder/service';

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
    }

    checkForEndSelection(event) {
        let selection = window.getSelection();
        if (selection.isCollapsed === false) {
            // Open annotator popup
            adderService.show();
        }
    }
}
module.exports = Annotation;
