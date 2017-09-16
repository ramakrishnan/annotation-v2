import textSelector from './textSelector.js';
import Constants from '../constants.js';

class Highlighter {
    constructor() {
    }

    highlightNodes(range) {
        let nodes = textSelector.getSelectedNodes(range);
        let highlightedNodes = [];
        let color = Constants.defaultColor;
        let spanNodes = [];
        for (let i = 0; i < nodes.length; i++) {
            let node = nodes[i];
            let spanNode = document.createElement('span');
            spanNode.setAttribute('class', color);
            spanNode.innerHTML = node.textContent;
            node.parentNode.insertBefore(spanNode, node);
            node.parentNode.removeChild(node);
            highlightedNodes.push(spanNode);
            spanNodes.push(spanNode)
        }
        return spanNodes;
    }
}

export default new Highlighter();