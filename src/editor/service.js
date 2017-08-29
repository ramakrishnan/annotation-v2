import editorTemplate from './editor.html.hbs';
import textSelector from '../services/textSelector.js';
import highlighter from '../services/highlighter.js';
import Utils from '../utils.js';

class AdderService {

    constructor() {
        this.$editor;
        this.currentNode;
    }

    get isVisible() {
        return this.$editor.classList.contains('annotation-hide') == false
    }

    show() {
        let position = textSelector.popupPosition;
        this.$editor.classList.remove('annotation-hide');
        this.$editor.style.top = (position.top - this.$editor.offsetHeight) + 'px';
        this.$editor.style.left = position.left + 'px';
        if (textSelector.tempAnnotatedNode) {
            this.currentNode = textSelector.tempAnnotatedNode;
        }
    }

    hide() {
        this.$editor.classList.add('annotation-hide');
    }

    inject() {
        let dom = document.createElement('div');
        dom.innerHTML = editorTemplate();
        this.$editor = dom.firstChild;
        document.body.append(this.$editor);
        this.bindEvents();
    }

    bindEvents() {
        let markers = this.$editor.querySelectorAll('button.marker');
        markers.forEach((element) => {
            element.addEventListener(('click'), (event) => {
                this.changeColor(event);
            });
        });
/*        document.querySelector('.annotation-save').addEventListener('click', (event) => {
            if (this.currentNode)
            this.currentNode.nodes.forEach((node) => {
                node.dataset.annotationId = '1234'
            })
        });*/
    }

    changeColor(event) {
        let color = event.target.getAttribute('data-color');
        let nodes = this.currentNode.nodes;
        let currentColor = this.currentNode.color;
        for (let i = 0; i < nodes.length; i++) {
            Utils.replaceClassName(nodes[i], currentColor, color);
        }
        // Update current node's color to the new color
        this.currentNode.color = color;
    }
}

export default new AdderService();