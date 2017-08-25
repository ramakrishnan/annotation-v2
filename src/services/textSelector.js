let xpathRange = require('xpath-range');

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

    getMousePosition(event) {
        // TODO: See if need further height correction using bounding rect
        let top = event.pageY;
        let left = event.pageX;
        return {
            top: top,
            left: left
        }
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
                hasAnnotation = parentElement.className.split(' ').indexOf('annotator-hl') !== -1
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
        if (startNode !== endNode) {
            let tree = document.createTreeWalker(parsedRange.commonAncestorContainer, 1).root;
            let endNodeFound = false;
            let startNodeFound = false;
            let parseComplete = false;
            let iterateNodes = (node) => {
                node.childNodes.forEach((n) => {
                    if (n.parentNode === startNode) {
                        startNodeFound = true;
                    } else if (n.parentElement === endNode) {
                        console.log('Stop wrapping');
                        endNodeFound = true;
                    }
                    if (startNodeFound === true && endNodeFound === false) {
                        if (n.nodeType === 3) {
                            nodes.push(n)
                        }
                        iterateNodes(n);
                    } else if (startNodeFound === true && endNodeFound === true && parseComplete === false) {
                        if (n.nodeType === 3) {
                            parseComplete = true;
                            nodes.push(n);
                        }
                    } else if (endNodeFound === false) {
                        iterateNodes(n);
                    }
                })
            };
            iterateNodes(tree);
            // Add start and end offset for the nodes
            let firstNode = nodes[0];
            let lastNod = nodes[nodes.length - 1]
            nodes[0] = firstNode.splitText(range.startOffset).parentNode.childNodes[1];
            nodes[nodes.length - 1] = lastNod.splitText(range.endOffset).parentNode.childNodes[0];
        } else {
            // This is a case where an entire node is selected or just a word in a node is selected.
            // Split the text nodes by start and end offset and pick the middle one
            let splitNode = startNode.childNodes[0].splitText(range.startOffset);
            startNode.childNodes[1].splitText(range.endOffset - range.startOffset);
            nodes.push(startNode.childNodes[1]);
        }
        return nodes;
    }
}

export default new TextSelector();