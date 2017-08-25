import textSelector from './textSelector.js';

class Highlighter {
    constructor() {
    }

    highlight(range, color) {
        let nodes = textSelector.getSelectedNodes(range);
        color = color || 'highlight';
        for (let i = 0; i < nodes.length; i++) {
            let node = nodes[i];
            let replacementNode = document.createElement('span');
            let stripText = node.textContent.replace(/\s/g, '');
            replacementNode.setAttribute('class', color);
            // replacementNode.dataset.annotationId = ''
            if (stripText.length > 0) {
                replacementNode.innerHTML = node.textContent;
                node.parentNode.insertBefore(replacementNode, node);
                node.parentNode.removeChild(node);
            }
        }
    }
}

export default new Highlighter();