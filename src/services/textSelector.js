let xpathRange = require('xpath-range');
var isMobile = require('is-mobile');

class TextSelector {
    constructor() {
        this._rootElement;
        this.nodes;
    }

    set rootElement(value) {
        this._rootElement = value;
    }

    get rootElement() {
        return this._rootElement;
    }

    getSelectedRange() {
        let selection = window.getSelection();
        let rangePath = {}
        if (selection.isCollapsed) {
            return [];
        } else {
            let range = selection.getRangeAt(0);
            let parentElement = range.commonAncestorContainer.parentElement;
            let hasAnnotation = false;
            if (parentElement && parentElement.nodeName === 'SPAN') {
                hasAnnotation = parentElement.classList.contains('annotator-hl');
            }
            if (hasAnnotation === false) {
                rangePath = xpathRange.fromRange(range, this.rootElement);
                rangePath.text = range.toString();
                selection.removeAllRanges();
                return rangePath
            } else {
                return [];
                selection.removeAllRanges();
            }
        }
    }

    isAnnotator(element) {
        var elAndParents = element.parents().addBack();
        return (elAndParents.filter('[class^=annotator-]').length !== 0);
    }

    getSelectedNodes(range) {
        let parsedRange = xpathRange.toRange(range.start,
            range.startOffset, range.end,
            range.endOffset, this.rootElement);
        let startNode = parsedRange.startContainer.parentNode;
        let endNode = parsedRange.endContainer.parentNode;
        let nodes = [];
        let tree = document.createTreeWalker(
            parsedRange.commonAncestorContainer,
            // Only consider nodes that are text nodes (nodeType 3)
            NodeFilter.SHOW_TEXT, {
                acceptNode: function(node) {
                    // Logic to determine whether to accept, reject or skip node
                    // In this case, only accept nodes that have content
                    // other than whitespace
                    // let textContent = node.data.replace(/\s/g, '');
                     if ( ! /^\s*$/.test(node.data) ) {
                        return NodeFilter.FILTER_ACCEPT;
                    }
                }
            }, false);
        let startNodeFound = false;
        if (startNode !== endNode) {
            let textNode = tree.nextNode();
            while (textNode) {
                let currentParent = textNode.parentNode;
                if (currentParent == startNode) {
                    startNodeFound = true;
                }
                if (startNodeFound) {
                    nodes.push(textNode);
                }
                if (currentParent == endNode) {
                    break
                }
                textNode = tree.nextNode();
            }
        } else {
            // This is a case where an entire node is selected or just a word in a node is selected.
            // Split the text nodes by start and end offset and pick the middle one
            // Get the index of the txt node selected
            let startTextNodeIndex = this.getTextNodeIndex(range.start);
            let endTextNodeIndex = this.getTextNodeIndex(range.end);
            let textNode;
            if (endTextNodeIndex == startTextNodeIndex) {
                textNode = this.getNodeForIndex(startNode, startTextNodeIndex);
                nodes.push(textNode);
            } else {
                textNode = this.getNodeForIndex(startNode, startTextNodeIndex);
                nodes.push(textNode);
                textNode = this.getNodeForIndex(startNode, endTextNodeIndex);
                nodes.push(textNode);
            }
        }
        let nodeLength = nodes.length;
        if (nodeLength == 1) {
            let firstNode = nodes[0];
            let splitNode = firstNode.splitText(range.startOffset);
            firstNode.nextSibling.splitText(range.endOffset - range.startOffset);
            nodes[0] = firstNode.nextSibling;
        } else if (nodeLength > 1) {
            // It is preferred to get the index of the text node selected.
            // This will take care of skipping appropriate <br/> tags within a 
            // parent element to reach the needed text node.
            if (startNode !== endNode) {
                let startTextNodeIndex = this.getTextNodeIndex(range.start);
                if ((startTextNodeIndex -1) > 0) {
                    nodes.splice(0, (startTextNodeIndex - 1));
                    nodeLength = nodes.length;
                }
            }
            let lastNode = nodes[nodeLength - 1];
            let firstNode = nodes[0];
            nodes[0] = firstNode.splitText(range.startOffset);
            nodes[nodeLength - 1] = lastNode.splitText(range.endOffset).previousSibling;
        }
        return nodes;
    }

    getTextNodeIndex(rangeStr) {
        let strIndex = rangeStr.lastIndexOf('[');
        return parseInt(rangeStr.substr(strIndex + 1, rangeStr.length));
    }

    getNodeForIndex(startNode, index) {
        let textNodeCount = 0;
        let textNode;
        let childNodes = startNode.childNodes;
        for (let i = 0; i < childNodes.length; i++) {
            if (childNodes[i].nodeType === 3)  {
                textNodeCount++;
                if (textNodeCount == index) {
                    textNode = childNodes[i];
                    break;
                }
            }
        }
        return textNode;
    }
}

export default new TextSelector();