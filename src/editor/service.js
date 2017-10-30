import editorTemplate from './editor.html.hbs';
import Utils from '../utils.js';
import Constants from '../constants.js';
var Map = require('es6-map/polyfill');

class AdderService {

    constructor() {
        this.$editor;
        this.currentAnnotation;
        this.annotatedNodes = new Map()
        this._extensions = []
    }

    set extensions(value) {
        this._extensions = value;
    }

    get extensions() {
        return this._extensions;
    }

    get isVisible() {
        return this.$editor.classList.contains('annotation-hide') == false
    }

    edit(annotationId) {
        let annotation = this.annotatedNodes.get(annotationId);
        this.show(annotation);
    }

    show(annotation) {
        this.currentAnnotation = annotation;
        let node = this.currentAnnotation.nodes[this.currentAnnotation.nodes.length - 1];
        let position = Utils.getNodePosition(node);
        Utils.removeClass(this.$editor, 'annotation-hide');
        this.$editor.style.top = position.top  + 'px';
        Utils.addClass(this.$editor, 'top');
        this.$editor.style.left = position.left - (this.$editor.offsetWidth / 2 ) + 'px';
        this.setFormValues();
    }

    setFormValues() {
        let form = this.$editor.querySelector('form');
        // FIXE: This fails unit test
        for(let attr in this.extensions.attributes) {
            form[attr].value = this.currentAnnotation[attr] || this.extensions.attributes[attr];
        }
    }

    hide() {
        this.$editor.classList.add('annotation-hide');
    }

    inject() {
        let dom = document.createElement('div');
        dom.innerHTML = editorTemplate(this.extensions.templateData);
        this.$editor = document.body.appendChild(dom.firstChild);
        this.bindEvents();
    }

    bindEvents() {
        let markers = this.$editor.querySelectorAll('button.marker');
        for (let i = 0; i < markers.length; i++) {
            markers[i].addEventListener('click', (event) => {
                this.changeColor(event);
            });
        }
        this.$editor.querySelector('.annotation-form').addEventListener('submit', (event) => {
            event.preventDefault();
            event.stopPropagation();
            this.onsave(event);
        });
        this.$editor.querySelector('.annotation-cancel').addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            this.oncancel(event);
        });
        this.$editor.querySelector('.annotation-delete').addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            this.ondelete(event);
        });
    }

    onsave(event) {
        let form = event.currentTarget;
        if (this.currentAnnotation && this.currentAnnotation.uuid === 'temp') {
            this.currentAnnotation.uuid = (new Date()).getTime().toString();
            this.currentAnnotation.nodes.forEach((node) => {
                node.dataset.annotationId = this.currentAnnotation.uuid
            })
        }
        this.changeHighlightColor(this.currentAnnotation.color, form.color.value);
        for(let attr in this.extensions.attributes) {
            this.currentAnnotation[attr] = form[attr].value;
        }
        this.annotatedNodes.set(this.currentAnnotation.uuid, this.currentAnnotation);
        this.hide();
    }

    oncancel(event) {
        if (this.currentAnnotation && this.currentAnnotation.uuid === 'temp') {
            this.annotatedNodes.delete('temp');
            Utils.removeHighlight(this.currentAnnotation.nodes);
        }
        this.currentAnnotation = null;
        this.hide();
    }

    ondelete(event) {
        Utils.removeHighlight(this.currentAnnotation.nodes);
        this.currentAnnotation = null;
        this.hide();
    }

    changeHighlightColor(prevColor, color) {
        let nodes = this.currentAnnotation.nodes;
        for (let i = 0; i < nodes.length; i++) {
            nodes[i].classList.remove(Constants.COLOR.temp);
            Utils.replaceClassName(nodes[i], prevColor, color);
        }
    }
}

export default new AdderService();