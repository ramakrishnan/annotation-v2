import textSelector from './textSelector.js';
import Constants from '../constants.js';

class Highlighter {
    constructor() {
    }

    highlight(range) {
        let nodes = textSelector.getSelectedNodes(range);
        let highlightedNodes = [];
        let color = [Constants.defaultColor, Constants.tempHighlight].join(' ');
        for (let i = 0; i < nodes.length; i++) {
            let node = nodes[i];
            let spanNode = document.createElement('span');
            spanNode.setAttribute('class', color);
            // spanNode.dataset.annotationId = ''
            spanNode.innerHTML = node.textContent;
            node.parentNode.insertBefore(spanNode, node);
            node.parentNode.removeChild(node);
            highlightedNodes.push(spanNode);
        }
        textSelector.tempAnnotatedNode = {
            nodes: highlightedNodes,
            color: Constants.tempHighlight
        };
    }
}

export default new Highlighter();