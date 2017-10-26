require('./styles/annotator.scss');
import textSelector from './services/textSelector.js';
import adderService from './adder/service';
import editorService from './editor/service';
import Utils from './utils.js'
import Constants from './constants.js'

class Annotation {
    constructor(element) {
        this.element = element;
        this.selectionTimer;
        textSelector.rootElement = element;
    }

    bindEvents() {
        document.addEventListener('selectionchange', (event) => {
            this.initSelection(event);
        }, false);
        document.querySelector('body').addEventListener('click', (event) => {
            this.initReview(event);
        }, true);
    }

    initReview(event) {
        let target = event.target;
        if (target.nodeName.toLowerCase() == 'span' &&
            target.classList.contains(Constants.COLOR.default)) {
            // Clicked on an highlighted span element
            editorService.edit(target.dataset.annotationId);
        }
    }

    initSelection(event) {
        if (editorService.isVisible === false) {
            clearTimeout(this.selectionTimer);
            this.selectionTimer = setTimeout(() => {
                this.checkForEndSelection(event);
            }, 500);
        }
    }

    adderExtensions(options) {
        adderService.extensions = options;
    }

    editorExtensions(options) {
        editorService.extensions = options;
    }

    init() {
        adderService.inject();
        editorService.inject();
        this.bindEvents();
    }

    checkForEndSelection(event) {
        let selection = window.getSelection();
        if (selection.isCollapsed === false) {
            let range = selection.getRangeAt(0);
            let position = Utils.getNodePosition(range);
            adderService.show(position);
            editorService.hide();
        } else {
            adderService.hide();
        }
    }
}
module.exports = Annotation;