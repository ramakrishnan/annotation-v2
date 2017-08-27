import highlightTemplate from './highlight.html.hbs';
import textSelector from '../services/textSelector.js';
import highlighter from '../services/highlighter.js';
import Utils from '../utils.js';

class AdderService {

    constructor() {
        this.$highlight;
        this.currentNodes;
    }

    get isVisible() {
        return this.$highlight.classList.contains('annotation-hide') == false
    }

    show() {
        let position = textSelector.popupPosition;
        this.$highlight.classList.remove('annotation-hide');
        this.$highlight.style.top = (position.top - this.$highlight.offsetHeight) + 'px';
        this.$highlight.style.left = position.left + 'px';
        if (textSelector.tempAnnotatedNode) {
            this.currentNodes = textSelector.tempAnnotatedNode;
        } else {
            this.currentNodes = textSelector.annotatedNoded.get('1234');
        }
    }

    hide() {
        this.$highlight.classList.add('annotation-hide');
    }

    inject() {
        let dom = document.createElement('div');
        dom.innerHTML = highlightTemplate();
        this.$highlight = dom.firstChild;
        document.body.append(this.$highlight);
        this.bindEvents();
    }

    bindEvents() {
        let markers = this.$highlight.querySelectorAll('button.marker');
        markers.forEach((element) => {
            element.addEventListener(('click'), (event) => {
                this.changeColor(event);
            });
        });
    }

    changeColor(event) {
        let color = event.target.getAttribute('data-color');
        let nodes = this.currentNodes.nodes;
        let currentColor = this.currentNodes.color;
        for (let i = 0; i < nodes.length; i++) {
            Utils.replaceClassName(nodes[i], currentColor, color);
        }
        // Update current node's color to the new color
        this.currentNodes.color = color;
    }
}

export default new AdderService();