const xpathRange = require('xpath-range');
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
        this.initSelection();
        document.querySelector('body').addEventListener('click', (event) => {
            this.initReview();
        }, true);
    }

    initReview() {
        let target = event.target;
        if (target.nodeName.toLowerCase() == 'span' &&
            target.classList.contains(Constants.COLOR.default)) {
            // Clicked on an highlighted span element
            editorService.restore(target.dataset.annotationId);
        }
    }

    initSelection() {
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
