/**
 * Main test runner
 */

const {Parser} = require('../src/parser');

const parser = new Parser();

test('convert string 33 to number 33', ()=>{
    const program = '33';
    const ast = parser.parse(program);
    expect(ast).toMatchObject({
        type: "Program",
            body: {
                type: 'NumericLiteral',
                value: 33
            }
    });
})

test('convert string hello to hello', ()=>{
    const program = `"hello"`;
    const ast = parser.parse(program);
    expect(ast).toMatchObject({
        type: "Program",
            body: {
                type: 'StringLiteral',
                value: "hello"
            }
    });
})
