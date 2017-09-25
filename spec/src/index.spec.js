// import EditorService from '../src/editor/service.js'
import Annotator from '../../src/index.js';
import editorService from '../../src/editor/service.js';
var ann;
describe('Annotation', () => {
    before(() => {
        ann = new Annotator(document.body);
    })
    describe('Bind events', () => {
        it('Should Bind Events for select change', () => {
            let eventListenerSpy = sinon.spy(document, 'addEventListener');
            let initSelectionStub = sinon.stub(ann, 'initSelection');
            ann.init();
            expect(eventListenerSpy.withArgs('selectionchange').calledOnce).to.be.true;
            eventListenerSpy.yield('data');
            expect(initSelectionStub.withArgs('data').calledOnce).to.be.true;
            eventListenerSpy.restore();
            initSelectionStub.restore();
        });
        it('Should Bind Events for select change', () => {
            let clickEventListenerSpy = sinon.spy(document.querySelector('body'), 'addEventListener');
            let initReviewStub = sinon.stub(ann, 'initReview');
            ann.init();
            expect(clickEventListenerSpy.withArgs('click').calledOnce).to.be.true;
            clickEventListenerSpy.yield('data');
            expect(initReviewStub.withArgs('data').calledOnce).to.be.true;
            clickEventListenerSpy.restore();
            initReviewStub.restore();
        });
    });

    describe('Init Selection', () => {
        let checkForEndSelectionSpy;
        let timeoutStub;
        beforeEach(() => {
            checkForEndSelectionSpy = sinon.stub(ann, 'checkForEndSelection');
            timeoutStub = sinon.stub(window, 'setTimeout');
        })
        afterEach(() => {
            checkForEndSelectionSpy.restore();
            timeoutStub.restore();
        })
        it('Should invoke checkForEndSelection when editor is NOT visible', (done) => {
            let editorStub = sinon.stub(editorService, 'isVisible').get(() => false);
            ann.initSelection();
            timeoutStub.yield(null, 1);
            expect(checkForEndSelectionSpy.calledOnce).to.be.true;
            done();
        })
        it('Should NOT invoke checkForEndSelection when editor is visible', (done) => {
            let editorStub = sinon.stub(editorService, 'isVisible').get(() => true);
            ann.initSelection();
            expect(checkForEndSelectionSpy.notCalled).to.be.true;
            expect(timeoutStub.notCalled).to.be.true;
            done();
        })
    });

    after(() => {
        // document.getElementsByClassName('annotation-float').remove();
    })
})