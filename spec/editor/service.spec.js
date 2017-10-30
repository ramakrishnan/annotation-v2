import EditorService from '../../src/editor/service.js';
import Utils from '../../src/utils.js';

describe('EditorService', () => {
    beforeEach(() => {
        EditorService.extensions = {
            templateData: {
                colors: ['yellow', 'red', 'green'],
            },
            attributes: {
                'color': 'red',
                'description': ''
            }
        }
        EditorService.inject();
    })
    afterEach(() => {
    	console.log('Clear11111')
        document.getElementsByClassName('annotation-editor')[0].remove();
    })
    describe('Edit', () => {
        it('Should load show with an annotation object', () => {
            EditorService.annotatedNodes.set('123', 'some_data');
            let showStub = sinon.stub(EditorService, 'show');
            EditorService.edit('123');
            expect(showStub.withArgs('some_data').calledOnce).to.be.true
            showStub.restore();
        })
    })

    describe('Show', () => {
        let getNodePositionStub;
        beforeEach(() => {
            let annotation = {
                description: 'Sample text',
                nodes: ['node1', 'node2']
            }
            getNodePositionStub = sinon.stub(Utils, 'getNodePosition')
                .returns({ top: 12, left: 34 });
            EditorService.show(annotation);
        });
        afterEach(() => {
            getNodePositionStub.restore();
        });

        it('Should display the pop w.r.t position of last node', () => {
            expect(getNodePositionStub.withArgs('node2').calledOnce).to.be.true;
            expect(EditorService.$editor.style.top).to.be.equal('12px');
        })
        it('Should have colors markers passed as part of config', () => {
            let colorMarkers = EditorService.$editor.querySelectorAll("input[type='radio'].marker")
            expect(colorMarkers.length).to.be.equal(3)
        });
    });

    describe('setFormValues', () => {
        it.skip('Should set editor form values as per annotation object', () => {
            EditorService.currentAnnotation = {
                description: 'Sample text'
            }
            let form = EditorService.$editor.querySelector('form');
            expect(form['description'].value).to.be.equal('Sample text')
        })
        it('Should set default value for editor form for attributes not present in annotation object', () => {
        	EditorService.currentAnnotation = {
        	    color: 'red'
        	}
            let form = EditorService.$editor.querySelector('form');
            expect(form['description'].value).to.be.equal('')
        })
    })

})