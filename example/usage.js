document.addEventListener("DOMContentLoaded", function(event) {
    var ann = new Annotator(document.body);
    ann.adderExtensions({
        afterShow: function(adder) {
            console.log('Adder template is', adder)
        },
        afterClick: function(adder, element) {
            console.log('adder', adder);
            console.log('element', element);
        }
    })
    ann.editorExtensions({
        templateData:{
            colors: [ 'yellow', 'red', 'green'],
        },
        attributes: {
            'color': 'red',
            'description': ''
        }
    })
    ann.init();
});