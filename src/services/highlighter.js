import textSelector from './textSelector.js';

class Highlighter {
    constructor() {
    }

    highlight(range, color) {
        let nodes = textSelector.getSelectedNodes(range);
        color = color || 'annotator-hl';
        for (let i = 0; i < nodes.length; i++) {
            let node = nodes[i];
            let spanNode = document.createElement('span');
            let stripText = node.textContent.replace(/\s/g, '');
            spanNode.setAttribute('class', color);
            // spanNode.dataset.annotationId = ''
            if (stripText.length > 0) {
                spanNode.innerHTML = node.textContent;
                node.parentNode.insertBefore(spanNode, node);
                node.parentNode.removeChild(node);
            }
        }
    }
}

export default new Highlighter();