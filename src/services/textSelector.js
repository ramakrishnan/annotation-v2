const xpathRange = require('xpath-range');
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
        if (startNode !== endNode) {
            nodes = this.getTextNodesBetweenNodes(startNode, endNode, tree, range);
        } else {
            nodes = this.getTextNodesFromNode(startNode, range.start, range.end);
        }
        let nodeLength = nodes.length;

        // Trim the first and last node to meet the start and end offset 
        // from selection
        if (nodeLength == 1) {
            let firstNode = nodes[0];
            let splitNode = firstNode.splitText(range.startOffset);
            firstNode.nextSibling.splitText(range.endOffset - range.startOffset);
            nodes[0] = firstNode.nextSibling;
        } else if (nodeLength > 1) {
            let lastNode = nodes[nodeLength - 1];
            let firstNode = nodes[0];
            nodes[0] = firstNode.splitText(range.startOffset);
            nodes[nodeLength - 1] = lastNode.splitText(range.endOffset).previousSibling;
        }
        return nodes;
    }

    // This is a case where an entire node is selected or just a word in a node is selected.
    // Split the text nodes by start and end offset and pick the middle one
    // Get the index of the txt node selected
    getTextNodesFromNode(startNode, startRange, endRange) {
        let nodes = [];
        let startPos = this.getTextNodePosition(startNode, startRange);
        let endPos = this.getTextNodePosition(startNode, endRange);

        let childNodes = startNode.childNodes;
        for (let i = 0; i < childNodes.length; i++) {
            if (i < startPos) {
                continue
            }
            if (i > endPos) {
                break
            }
            if (childNodes[i].nodeType !== 3) {
                nodes = nodes.concat(this.getAllTextNodes(childNodes[i]));
            } else {
                nodes.push(childNodes[i]);
            }
        }
        return nodes;
    }

    getAllTextNodes(node) {
        let nodes = [];
        let childNodes = node.childNodes;
        for (let i = 0; i < childNodes.length; i++) {
            if (childNodes[i].nodeType == 3) {
                nodes.push(childNodes[i]);
            } else {
                nodes = nodes.concat(this.getAllTextNodes(childNodes[i]));
            }
        }
        return nodes;
    }

    // Traverse the DOM tree and pick all text nodes 
    // which fall between start and end node
    getTextNodesBetweenNodes(startNode, endNode, tree, range) {
        let nodes = [];
        let startNodeFound = false;
        let endtNodeFound = false;
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
                break;
            }
            textNode = tree.nextNode();
        }
        // When node length is more than 1 and start and end node are same.
        // It is more likely that there are few <br> which resulted in more then
        // one text node.
        // It is preferred to get the index of the text node selected.
        // And remove the other nodes before them.
        if (endNode.childNodes.length > 0) {
            let endTextNodePos = this.getTextNodePosition(endNode, range.end);
            let endTextNodes = this.getAllTextNodes(endNode);
            let lastTextNode = endNode.childNodes[endTextNodePos];
            let actualEndNodeIndex = endTextNodes.indexOf(lastTextNode);
            let actualEndNodes = endTextNodes.splice(0, actualEndNodeIndex + 1);
            let nodesLength = nodes.length;
            let lastPushedNode = actualEndNodes.indexOf(nodes[nodesLength -1]);
            actualEndNodes.splice(0, lastPushedNode + 1);
            nodes = nodes.concat(actualEndNodes);
        }
        if (nodes.length > 1) {
            let startTextNodePos = this.getTextNodePosition(startNode, range.start);
            let startText = startNode.childNodes[startTextNodePos];
            let startIndex = nodes.indexOf(startText);
            nodes.splice(0, startIndex);
        }
        return nodes;
    }

    /* 
     @return Integer [index]
     This functin returns the index of the text node w.r.t the parent node
    */
    getTextNodePosition(node, rangeStr) {
        let strIndex = rangeStr.lastIndexOf('text()[');
        if (strIndex != -1) {
            strIndex = strIndex + 6;
        }
        let position = parseInt(rangeStr.substr(strIndex + 1, rangeStr.length));
        return this.getCurrentIndexOfTextNode(node, position);
    }

    /*
    @params startNode [DOM]
    @params index [Number]
    A start node may hane several text nodes, 
    return the text node for the given index
    */
    getCurrentIndexOfTextNode(startNode, index) {
        let textNodeCount = 0;
        let currentNodeIndex;
        let childNodes = startNode.childNodes;
        for (let i = 0; i < childNodes.length; i++) {
            if (childNodes[i].nodeType === 3)  {
                textNodeCount++;
                if (textNodeCount == index) {
                    currentNodeIndex = i;
                    break;
                }
            }
        }
        return currentNodeIndex;
    }
}

export default new TextSelector();