/**
 * Main test runner
 */
const { sequenceOf, str } =require("../src/parser.js");

test("parse string", () => {
    const parser = sequenceOf([
        str('hello world'),
        str('hello aaa world')
    ]); 
    const result = parser.run("hello worldhello aaa world");
    expect(result).toMatchObject({
        targetString: 'hello worldhello aaa world',
        index: 26,
        result: [ 'hello world', 'hello aaa world' ],
        isError: false,
        error: null
    })
})

test("parse unmatched string", () => {
    const parser = //sequenceOf([
        str('hello world');
        // str('hello aaa world')
        // ]); 
        const result = parser.run("hello");
        
        expect(result).toMatchObject({
            targetString: 'hello',
            index: 0,
            result: null,
            isError: true,
            error: 'Trying to match hello world, got "hello"'
        })
    })
    
    test("parse sequence of string", () => {
        const parser = sequenceOf([
            str('hello world'),
            str('hello aaa world')
        ]); 
        const result = parser.run("hello worldhello aaa world");
    
    expect(result).toMatchObject({
        targetString: 'hello worldhello aaa world',
        index: 26,
        result: [ 'hello world', 'hello aaa world' ],
        isError: false,
        error: null
    })
})

test("map parser result", () => {
    const parser = str('hello').map(f => ({value: f.toUpperCase()}));
    const result = parser.run('hello');
    expect(result).toMatchObject({
        targetString: 'hello',
        index: 5,
        result: {value:'HELLO'},
        isError: false,
        error: null
    })

})

