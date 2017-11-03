let xpathRange = require('xpath-range');
import TextSelectorService from '../../src/services/textSelector.js';
import rangeMapper from '../range-data.js';

var getRangeAtStub;
var removeRangeAtStub;
var getSelectionStub;
var toStringStub;

TextSelectorService.rootElement = document.body;

describe('Text Selector service', () => {
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
            let range = rangeMapper.get('only-one-word-selected')
            let node = TextSelectorService.getSelectedNodes(range);
            expect(node.length).to.equal(1);
            expect(node[0].textContent).to.equal('OVERVIEW');
        })

        it('When an entire line is selected, which has two span tags within it', () => {
            let range = rangeMapper.get('entire-line-with-2-spans');
            let node = TextSelectorService.getSelectedNodes(range);
            expect(node.length).to.equal(2);
            expect(node[0].textContent).to.equal('Hellow ');
            expect(node[1].textContent).to.equal('World');
        })
        it('When middle few words are selected from line', () => {
            let range = rangeMapper.get('few-middle-words-in-line-selected');
            let node = TextSelectorService.getSelectedNodes(range);
            expect(node.length).to.equal(1);
            expect(node[0].textContent).to.equal("test all possible");
        })
        it('When selected across different nodes which has multiple brs', () => {
            let range = rangeMapper.get('selected-across-nodes-by-crossing-brs');
            let node = TextSelectorService.getSelectedNodes(range);
            expect(node.length).to.equal(3);
            expect(node[0].textContent).to.equal('for annotation ');
            expect(node[1].textContent).to.equal(' :) ');
            expect(node[2].textContent).to.equal(' A huge paragraph');
        })
        it('When selected across different nodes which do not have brs in them', () => {
            let range = rangeMapper.get('selected-across-nodes-without-crossing-a-br');
            let node = TextSelectorService.getSelectedNodes(range);
            expect(node.length).to.equal(2);
            expect(node[0].textContent).to.equal('body content');
            expect(node[1].textContent).to.equal(' A huge paragraph');
        })
        it('When selected within a same node which has brs', () => {
            let range = rangeMapper.get('selected-within-same-node-which-haa-brs');
            let node = TextSelectorService.getSelectedNodes(range);
            expect(node.length).to.equal(2);
            expect(node[0].textContent).to.equal('for annotation ');
            expect(node[1].textContent).to.equal(' :)');
        })
    })
})