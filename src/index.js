let xpathRange = require('xpath-range');

require('./styles/annotator.scss');
import textSelector from './services/textSelector.js';
import adderService from './adder/service';
import editorService from './editor/service';
import Utils from './utils.js'

class Annotation {
    constructor(element) {
        this.element = element;
        this.selectionTimer;
        if (Utils.isMobile()) {
            document.addEventListener('selectionchange', (e) => {
                clearTimeout(this.selectionTimer);
                this.selectionTimer = setTimeout(() => {
                    this.checkForEndSelection(e);
                }, 500);
            });
        } else {
            /*this.element.addEventListener('mouseup', (e) => {
                e.preventDefault();
                this.checkForEndSelection(e);
            });*/
            document.addEventListener('selectionchange', (e) => {
                clearTimeout(this.selectionTimer);
                this.selectionTimer = setTimeout(() => {
                    this.checkForEndSelection(e);
                }, 500);
            });
        }
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
        if (selection.isCollapsed === false) {
            let range = selection.getRangeAt(0);
            let position = textSelector.getMousePosition(range);
            adderService.show(position);
            editorService.hide();
        } else {
            adderService.hide();
        }
    }
}
module.exports = Annotation;
