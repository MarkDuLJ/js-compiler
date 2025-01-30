/**
 * Main test runner
 */
const { run, sequenceOf, str } =require("../src/parser.js");

test("parse string", () => {
    const parser = sequenceOf([
        str('hello world'),
        str('hello aaa world')
    ]); 
    const result = run(parser,"hello worldhello aaa world");
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
        const result = run(parser,"hello");
        
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
        const result = run(parser,"hello worldhello aaa world");
        console.log(result);
    
    expect(result).toMatchObject({
        targetString: 'hello worldhello aaa world',
        index: 26,
        result: [ 'hello world', 'hello aaa world' ],
        isError: false,
        error: null
    })
})

