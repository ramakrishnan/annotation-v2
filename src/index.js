let xpathRange = require('xpath-range');

require('./styles/annotator.scss');
import textSelector from './services/textSelector.js';
import adderService from './adder/service';
import editorService from './editor/service';

class Annotation {
    constructor(element) {
        this.element = element;
        this.element.addEventListener('mouseup', (e) => {
            this.checkForEndSelection(e);
        });
        textSelector.rootElement = element;
    }

    bindEvents() {
        document.addEventListener('click', (event) => {
            let target = event.target;
            if (target.nodeName.toLowerCase() == 'span' &&
                target.classList.indexOf(Constants.tempHighlight) == -1 &&
                target.classList.indexOf(Constants.defaultColor) !== -1) {
                // Clicked on an highlighted span element
                console.log(target.dataset.annotationId)
            }
        });
    }

    init() {
        adderService.inject();
        editorService.inject();
    }

    checkForEndSelection(event) {
        let selection = window.getSelection();
        if (selection.isCollapsed === false && adderService.isVisible === false) {
            let position = textSelector.getMousePosition(event)
            adderService.show(position);
            editorService.hide();
        } else {
            adderService.hide();
        }
    }
}
module.exports = Annotation;
