import adderTemplate from './adder.html.hbs';
import textSelector from '../services/textSelector.js';
import highlighter from '../services/highlighter.js';
import highlightService from '../highlight/service.js';

class AdderService {

    constructor() {
        this.$adder;
    }

    get isVisible() {
        return this.$adder.classList.contains('annotation-hide') == false
    }

    show(position) {
        this.$adder.classList.remove('annotation-hide');
        this.$adder.style.top = (position.top - this.$adder.offsetHeight)+ 'px';
        this.$adder.style.left = position.left + 'px';
    }

    hide() {
        this.$adder.classList.add('annotation-hide');
    }

    inject() {
        let dom = document.createElement('div');
        dom.innerHTML = adderTemplate();
        this.$adder = dom.firstChild;
        document.body.append(this.$adder);
        this.bindEvents();
    }

    bindEvents() {
        this.$adder.querySelector('button.highlight').addEventListener(('click'), (event) => {
            this.makeTempSelection(event);
        })
        this.$adder.querySelector('button.highlight').addEventListener(('click'), (event) => {
            this.makeTempSelection(event);
        })
    }

    makeTempSelection(event) {
        let range = textSelector.getSelectedRange();
        if (range.length !== 0) {
            highlighter.highlight(range);
        }
        highlightService.show();
    }
}

export default new AdderService();