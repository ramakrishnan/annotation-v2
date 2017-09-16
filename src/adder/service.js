import adderTemplate from './adder.html.hbs';
import textSelector from '../services/textSelector.js';
import highlighter from '../services/highlighter.js';
import editortService from '../editor/service.js';
import Utils from '../utils.js'
import Constants from '../constants.js';

class AdderService {

    constructor() {
        this.$adder;
    }

    get isVisible() {
        return this.$adder.classList.contains('annotation-hide') == false
    }

    show(position) {
        this.$adder.classList.remove('annotation-hide');
        this.$adder.style.top = position.top  + 'px';
        this.$adder.classList.add('top');
        this.$adder.style.left = position.left - (this.$adder.offsetWidth / 2) + 'px';
    }

    hide() {
        this.$adder.classList.add('annotation-hide');
    }

    inject() {
        let dom = document.createElement('div');
        dom.innerHTML = adderTemplate();
        this.$adder = dom.firstChild;
        document.body.appendChild(this.$adder);
        this.bindEvents();
    }

    bindEvents() {
        this.$adder.querySelector('button.highlight').addEventListener(('click'), (event) => {
            this.makeTempSelection(event);
        });
    }

    makeTempSelection(event) {
        let range = textSelector.getSelectedRange();
        let nodes;
        if (range.length !== 0) {
            nodes = highlighter.highlightNodes(range);
        }
        let tempAnnotation = {
            nodes: nodes,
            color: Constants.defaultColor,
            range: range,
            uuid: 'temp'
        };
        editortService.show(tempAnnotation);
    }
}

export default new AdderService();