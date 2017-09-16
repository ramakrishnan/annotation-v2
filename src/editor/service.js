import editorTemplate from './editor.html.hbs';
import textSelector from '../services/textSelector.js';
import highlighter from '../services/highlighter.js';
import Utils from '../utils.js';

class AdderService {

    constructor() {
        this.$editor;
        this.currentAnnotation;
        this.annotatedNodes = new Map();
        this._extensions;
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

    restore(annotationId) {
        let annotation = this.annotatedNodes.get(annotationId);
        this.show(annotation);
    }

    show(annotation) {
        this.currentAnnotation = annotation;
        let node = this.currentAnnotation.nodes[this.currentAnnotation.nodes.length - 1];
        let position = Utils.getNodePosition(node);
        this.$editor.classList.remove('annotation-hide');
        this.$editor.style.top = position.top  + 'px';
        this.$editor.classList.add('top');
        this.$editor.style.left = position.left - (this.$editor.offsetWidth / 2 ) + 'px';
    }

    hide() {
        this.$editor.classList.add('annotation-hide');
    }

    inject() {
        let dom = document.createElement('div');
        dom.innerHTML = editorTemplate();
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
        this.$editor.querySelector('.annotation-save').addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            this.onsave(event);
        });
        this.$editor.querySelector('.annotation-cancel').addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            this.oncancel(event);
        });
    }

    onsave(event) {
        if (this.currentAnnotation && this.currentAnnotation.uuid === 'temp') {
            this.currentAnnotation.uuid = (new Date()).getTime().toString();
            this.currentAnnotation.nodes.forEach((node) => {
                node.dataset.annotationId = this.currentAnnotation.uuid
            })
        }
        this.annotatedNodes.set(this.currentAnnotation.uuid, this.currentAnnotation);
        this.hide();
    }

    oncancel(event) {
        if (this.currentAnnotation && this.currentAnnotation.uuid === 'temp') {
            this.annotatedNodes.delete('temp')
        }
        this.currentAnnotation = null;
        this.hide();
    }

    changeColor(event) {
        let color = event.target.getAttribute('data-color');
        let nodes = this.currentAnnotation.nodes;
        let currentColor = this.currentAnnotation.color;
        for (let i = 0; i < nodes.length; i++) {
            Utils.replaceClassName(nodes[i], currentColor, color);
        }
        this.currentAnnotation.color = color;
    }
}

export default new AdderService();