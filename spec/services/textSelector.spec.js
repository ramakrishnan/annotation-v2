let xpathRange = require('xpath-range');
import TextSelectorService from '../../src/services/textSelector.js';

var getRangeAtStub;
var removeRangeAtStub;
var getSelectionStub;
var toStringStub;

TextSelectorService.rootElement = document.body;

describe('Text Selecto service', () => {
    describe('getSelectedRange', () => {
        before(() => {
            var content = document.createElement('div');
            content.innerHTML = __template;
            document.body.appendChild(content.firstChild);
        })
        after(() => {
            document.getElementById('dummy-html').remove();
        })
        describe('When nothing is selected', () => {
            it('Should retun an empty array', () => {
                getSelectionStub = sinon.stub(window, 'getSelection').returns({
                    isCollapsed: true
                })
                let data = TextSelectorService.getSelectedRange();
                expect(data).to.deep.equal([]);
                getSelectionStub.restore();
            })
        })
        describe('When something is selected', () => {
            let selectedString = 'Hellow-world';
            beforeEach(() => {
                toStringStub = sinon.stub().returns(selectedString);
                getRangeAtStub = sinon.stub().withArgs(0).returns({
                    commonAncestorContainer: {},
                    toString: toStringStub
                });
                removeRangeAtStub = sinon.stub();
                getSelectionStub = sinon.stub(window, 'getSelection').returns({
                    isCollapsed: false,
                    getRangeAt: getRangeAtStub,
                    removeAllRanges: removeRangeAtStub
                });
            })
            it('Should return a xpath range for a selected range', () => {
                let xpathRangeStub = sinon.stub(xpathRange, 'fromRange')
                    .returns({
                        xpath: 'some-xpath'
                    })
                let data = TextSelectorService.getSelectedRange();
                expect(data).to.deep.equal({
                    xpath: 'some-xpath',
                    text: selectedString
                });
                expect(removeRangeAtStub.calledOnce).to.be.true;
            })
            afterEach(() => {
                toStringStub.reset();
                getRangeAtStub.reset();
                removeRangeAtStub.reset();
                getSelectionStub.restore();
            })
        })
    })

    describe('getSelectedNodes', () => {
        beforeEach(() => {
            var content = document.createElement('div');
            content.innerHTML = __template;
            document.body.appendChild(content.firstChild);
        })
        afterEach(() => {
            document.getElementById('dummy-html').remove();
        })
        it('When only one word is selected', () => {
            let range = {
            "start": "/div[1]/div[1]/header[1]/div[1]/h1[1]/text()[1]",
            "end": "/div[1]/div[1]/header[1]/div[1]/h1[1]/text()[1]",
            "startOffset": 0,
            "endOffset": 8,
            "text": "OVERVIEW"
            };
            let node = TextSelectorService.getSelectedNodes(range);
            expect(node.length).to.equal(1);
            expect(node[0].data).to.equal('OVERVIEW');
        })

        it('When an entire line is selected, which has two span tags within it', () => {
            let range = {
                "start": "/div[1]/div[1]/header[1]/h1[1]/span[1]/text()[1]",
                "end": "/div[1]/div[1]/header[1]/h1[1]/span[2]/text()[1]",
                "startOffset": 0,
                "endOffset": 5,
                "text": "Hellow World"
            };
            let node = TextSelectorService.getSelectedNodes(range);
            expect(node.length).to.equal(2);
            expect(node[0].data).to.equal('Hellow ');
            expect(node[1].data).to.equal('World');
        })
        it('When middle few words are selected from line', () => {
            let range = {
                "start": "/div[1]/div[1]/header[1]/div[1]/h1[1]/text()[2]",
                "end": "/div[1]/div[1]/header[1]/div[1]/h1[1]/text()[2]",
                "startOffset": 34,
                "endOffset": 51,
                "text": "test all possible"
            }
            let node = TextSelectorService.getSelectedNodes(range);
            expect(node.length).to.equal(1);
            expect(node[0].data).to.equal("test all possible");
        })
        it('When selected across different nodes which has multiple brs', () => {
            let range = {
                "start": "/div[1]/div[1]/header[1]/div[1]/h1[1]/text()[3]",
                "end": "/div[1]/div[1]/p[1]/text()[1]",
                "startOffset": 25,
                "endOffset": 17,
                "text": "annotation  :)                                 A huge paragraph"
            }
            let node = TextSelectorService.getSelectedNodes(range);
            expect(node.length).to.equal(3);
            expect(node[0].data).to.equal('annotation ');
            expect(node[1].data).to.equal(' :) ');
            expect(node[2].data).to.equal(' A huge paragraph');
        })
        it('When selected across different nodes which do not have brs in them', () => {
            let range = {
                "start": "/div[1]/div[2]/header[1]/text()[1]",
                "end": "/div[1]/div[2]/p[1]/text()[1]",
                "startOffset": 5,
                "endOffset": 17,
                "text": "body content          A huge paragraph"
            }
            let node = TextSelectorService.getSelectedNodes(range);
            expect(node.length).to.equal(2);
            expect(node[0].data).to.equal('body content');
            expect(node[1].data).to.equal(' A huge paragraph');
        })
        it('When selected within a same node which has brs', () => {
            let range = {
                "start": "/div[1]/div[1]/header[1]/div[1]/h1[1]/text()[2]",
                "end": "/div[1]/div[1]/header[1]/div[1]/h1[1]/text()[3]",
                "startOffset": 26,
                "endOffset": 35,
                "text": "we will test all possible contents                      for annotation"
            }
            let node = TextSelectorService.getSelectedNodes(range);
            expect(node.length).to.equal(2);
            expect(node[0].data).to.equal('we will test all possible contents ');
            expect(node[1].data).to.equal('                     for annotation');
        })
    })
})