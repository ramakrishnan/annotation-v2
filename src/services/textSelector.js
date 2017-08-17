let xpathRange = require('xpath-range');
import highlighter from './highlighter.js';

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

    captureSelectedRange() {
        let range = this.getSelectedRange();
        if (range.length !== 0) {
            this.nodes = this.getSelectedNodes(range);
            highlighter.highlight(this.nodes);
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
        let tree = document.createTreeWalker(parsedRange.commonAncestorContainer, 1).root;
        let endNodeFound = false;
        let startNodeFound = false;
        let parseComplete = false;
        let nodes = [];
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
        return nodes;
    }
}

export default new TextSelector();