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
}
export default new Utils();