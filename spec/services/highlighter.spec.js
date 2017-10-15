import Highlighter from '../../src/services/highlighter.js'
import TextSelectorService from '../../src/services/textSelector.js';
import Constants from '../../src/constants.js';

TextSelectorService.rootElement = document.body;

describe('Highlighter Service', () => {
    describe('highlight Nodes', () => {
        beforeEach(() => {
            var content = document.createElement('div');
            content.innerHTML = __template;
            document.body.appendChild(content.firstChild);
        })
        afterEach(() => {
            document.getElementById('dummy-html').remove();
        })
        context('When passed a xpath range', () => {
            it('Should wrap the nodes in a Span Node', () => {
                let range = {
                    "start": "/div[1]/div[1]/header[1]/div[1]/h1[1]/text()[1]",
                    "end": "/div[1]/div[1]/header[1]/div[1]/h1[1]/text()[1]",
                    "startOffset": 0,
                    "endOffset": 8,
                    "text": "OVERVIEW"
                };
                let spans = Highlighter.highlightNodes(range);
                expect(spans.length).to.be.equal(1);
                expect(spans[0].getAttribute('class')).to.be.equal(Constants.COLOR.default);
                expect(spans[0].parentNode.nodeName).to.be.equal('H1');
            })
        })
    })
})