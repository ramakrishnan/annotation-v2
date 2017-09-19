import adderTemplate from './adder.html.hbs';
import textSelector from '../services/textSelector.js';
import highlighter from '../services/highlighter.js';
import editortService from '../editor/service.js';
import Utils from '../utils.js'
import Constants from '../constants.js';

class AdderService {

    constructor() {
        this.$adder;
        this._extensions = {};
    }

    set extensions(value) {
        this._extensions = value;
    }

    get extensions() {
        return this._extensions;
    }

    get isVisible() {
        return this.$adder.classList.contains('annotation-hide') == false
    }

    show(position) {
        this.$adder.classList.remove('annotation-hide');
        this.$adder.style.top = position.top  + 'px';
        this.$adder.classList.add('top');
        this.$adder.style.left = position.left - (this.$adder.offsetWidth / 2) + 'px';
        if (this.extensions['afterShow']) {
            this.extensions['afterShow'].call(window, this.$adder);
        }
    }

    hide() {
        this.$adder.classList.add('annotation-hide');
    }

    inject() {
        let dom = document.createElement('div');
        dom.innerHTML = adderTemplate();
        this.$adder = document.body.appendChild(dom.firstChild);
        this.bindEvents();
    }

    bindEvents() {
        this.$adder.querySelector('button').addEventListener('click', (event) => {
            if (this.extensions['afterClick']) {
                this.extensions['afterClick'].call(window, this.$adder, event.currentTarget);
            }
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
            range: range,
            uuid: 'temp'
        };
        this.hide();
        editortService.show(tempAnnotation);
    }
}

export default new AdderService();