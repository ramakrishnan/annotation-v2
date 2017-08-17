import adderTemplate from './adder.html.hbs';
import textSelector from '../services/textSelector.js';
class AdderService {

    constructor() {
        this.$adder;
    }

    show() {
        this.$adder.classList.remove('annotation-hide');
        // textSelector.captureSelectedRange();
    }

    inject() {
        let adderDom = document.createElement('div');
        adderDom.innerHTML = adderTemplate();
        this.$adder = adderDom.firstChild;
        document.body.append(this.$adder);
        this.bindEvents();
    }

    bindEvents() {
        this.$adder.querySelector('button').addEventListener(('click'), (event) => {
            this.clickMe(event);
        })
    }

    clickMe(event) {
        textSelector.captureSelectedRange();
    }
}

export default new AdderService();