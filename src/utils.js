class Utils {
    constructor() {}
    replaceClassName(node, oldName, newName) {
        let classNames = node.getAttribute('class').split(' ');
        let index = classNames.indexOf(oldName);
        if (index != -1) {
            classNames[index] = newName;
        } else {
            classNames.push(newName);
        }
        node.setAttribute('class', classNames.join(' '))
    }

    getNodePosition(node) {
        let clientRect = node.getClientRects();
        let boundingRect = clientRect[clientRect.length - 1];
        let left = boundingRect.left + (boundingRect.width / 2);
        let top = boundingRect.top + window.scrollY;
        top = top + boundingRect.height;
        return {
            top: top,
            left: left
        }; 
    }

    isMobile() {
        return false;
    }
}
export default new Utils();