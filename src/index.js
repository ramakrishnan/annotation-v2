let xpathRange = require('xpath-range');
class Annotation {
    constructor(element) {
        this.element = element;
        this.element.addEventListener('mouseup', (e) => {
            this.checkForEndSelection(e);
        });
    }

    wrapSpan(nodes) {
        for(let i=0; i<nodes.lenght; i++) {
            let node = nodes[i];
            var replacementNode = document.createElement('span');
            replacementNode.setAttribute('class', 'highlight');
            let stripText = node.textContent.replace(/\s/g, '');
            if (stripText.length > 0) {
                replacementNode.innerHTML = node.textContent;
                node.parentNode.insertBefore(replacementNode, node);
                node.parentNode.removeChild(node);
            }
        }
    }

    checkForEndSelection(event) {
        var selectedRanges = this.captureDocumentSelection();
        if (selectedRanges.length === 0) {
            return;
        }
        console.log(selectedRanges);
        // toRange(startPath, startOffset, endPath, endOffset, root) {
        let finalToRamge = xpathRange.toRange(selectedRanges.start, selectedRanges.startOffset, selectedRanges.end, selectedRanges.endOffset, this.element);
        this.pickNodesFromRange(finalToRamge);
    }

    pickNodesFromRange(range) {
        let startNode = range.startContainer.parentNode;
        let endNode = range.endContainer.parentNode;
        let tree = document.createTreeWalker(range.commonAncestorContainer, 1).root;
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
        this.wrapSpan(nodes);
    }

    captureDocumentSelection() {
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
                rangePath = xpathRange.fromRange(range, this.element);
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

}
module.exports = Annotation;