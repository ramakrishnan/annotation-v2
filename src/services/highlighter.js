class Highlighter {
    constructor() {

    }

    highlight(nodes, color) {
        color = color || 'highlight';
        for (let i = 0; i < nodes.length; i++) {
            let node = nodes[i];
            var replacementNode = document.createElement('span');
            replacementNode.setAttribute('class', color);
            let stripText = node.textContent.replace(/\s/g, '');
            if (stripText.length > 0) {
                replacementNode.innerHTML = node.textContent;
                node.parentNode.insertBefore(replacementNode, node);
                node.parentNode.removeChild(node);
            }
        }
    }
}

export default new Highlighter();