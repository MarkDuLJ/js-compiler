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

test('accept single quote string hi to hi', ()=>{
    const program = `'hi'`;
    const ast = parser.parse(program);
    expect(ast).toMatchObject({
        type: "Program",
            body: {
                type: 'StringLiteral',
                value: "hi"
            }
    });
})

test('skip whitespaces', ()=>{
    const program = `  55  `;
    const ast = parser.parse(program);
    expect(ast).toMatchObject({
        type: "Program",
            body: {
                type: 'NumericLiteral',
                value: 55
            }
    });
})

test('not skip whitespaces in string', ()=>{
    const program = `  "11 22 33"  `;
    const ast = parser.parse(program);
    expect(ast).toMatchObject({
        type: "Program",
            body: {
                type: 'StringLiteral',
                value: "11 22 33"
            }
    });
})

test('single line comment', ()=>{
    const program = `  
    /this is single line comment
    "comment"
     `;
    const ast = parser.parse(program);
    expect(ast).toMatchObject({
        type: "Program",
            body: {
                type: 'StringLiteral',
                value: "comment"
            }
    });
})

test('multiline comment', ()=>{
    const program = `
      
    /**this is single line comment
     * 
    *multiline
    */
    "documention comment"
     `;
    const ast = parser.parse(program);
    expect(ast).toMatchObject({
        type: "Program",
            body: {
                type: 'StringLiteral',
                value: "documention comment"
            }
    });
})

