var Map = require('es6-map/polyfill');
var rangeMapper = new Map();

rangeMapper.set('only-one-word-selected', {
    "start": "/div[1]/div[1]/header[1]/div[1]/h1[1]/text()[1]",
    "end": "/div[1]/div[1]/header[1]/div[1]/h1[1]/text()[1]",
    "startOffset": 0,
    "endOffset": 8,
    "text": "OVERVIEW"
})

rangeMapper.set('entire-line-with-2-spans', {
    "start": "/div[1]/div[1]/header[1]/h1[1]/span[1]/text()[1]",
    "end": "/div[1]/div[1]/header[1]/h1[1]/span[2]/text()[1]",
    "startOffset": 0,
    "endOffset": 5,
    "text": "Hellow World"
})

rangeMapper.set('few-middle-words-in-line-selected', {
    "start": "/div[1]/div[1]/header[1]/div[1]/h1[1]/text()[2]",
    "end": "/div[1]/div[1]/header[1]/div[1]/h1[1]/text()[2]",
    "startOffset": 34,
    "endOffset": 51,
    "text": "test all possible"
})

rangeMapper.set('selected-across-nodes-by-crossing-brs', {
    "start": "/div[1]/div[1]/header[1]/div[1]/h1[1]/text()[3]",
    "end": "/div[1]/div[1]/p[1]/text()[1]",
    "startOffset": 21,
    "endOffset": 17,
    "text": "for annotation  :)                                 A huge paragraph"
})

rangeMapper.set('selected-across-nodes-without-crossing-a-br', {
    "start": "/div[1]/div[2]/header[1]/text()[1]",
    "end": "/div[1]/div[2]/p[1]/text()[1]",
    "startOffset": 5,
    "endOffset": 17,
    "text": "body content          A huge paragraph"
})

rangeMapper.set('selected-within-same-node-which-haa-brs', {
    "start": "/div[1]/div[1]/header[1]/div[1]/h1[1]/text()[3]",
    "end": "/div[1]/div[1]/header[1]/div[1]/h1[1]/text()[4]",
    "startOffset": 21,
    "endOffset": 3,
    "text": "for annotation  :)"
})
export default rangeMapper