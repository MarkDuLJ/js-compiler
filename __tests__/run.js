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
        result: [ 'hello world', 'hello aaa world' ]
    })
})

test("parse unmatched string", () => {
    const parser = //sequenceOf([
        str('hello world');
        // str('hello aaa world')
    // ]); 
    const result = run(parser,"hello");
    console.log(result);
    
    expect(result).toMatchObject({
        targetString: 'hello',
      index: 0,
      result: null,
      isError: true,
      error: 'Trying to match hello world, got "hello"'
    })
})

