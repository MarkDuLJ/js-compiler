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

