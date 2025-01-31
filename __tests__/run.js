/**
 * Main test runner
 */
const { 
    sequenceOf,
    str, 
    letters, 
    digits, 
    choice, 
    many, 
    manyOne,
    between,
} =require("../src/parser.js");

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
    const parser = str('hello')
        .map(f => ({value: f.toUpperCase()}))
        .errorMap((msg,index) => `Expected info @ index ${index}`);
    const result = parser.run('hello');
    expect(result).toMatchObject({
        targetString: 'hello',
        index: 5,
        result: {value:'HELLO'},
        isError: false,
        error: null
    })
})

test("letter parser", () => {
    const parser = letters;
    const result = letters.run("hello");
    expect(result).toMatchObject({
        targetString: 'hello',
        index: 5,
        result: 'hello',
        isError: false,
        error: null
    })
})

test("letter parser with numbers", () => {
    const parser = letters;
    const result = letters.run("12345");
    expect(result).toMatchObject({
        error: "Letter:Trying to match at index 0",
       index: 0,
       isError: true,
       result: null,
       targetString: "12345"
    })
})

test("digit parser", () => {
    const parser = digits;
    const result = digits.run("12345");
    expect(result).toMatchObject({
        error: null,
        index: 5,
        isError: false,
        result: "12345",
        targetString: "12345"
    })
})

test("sequence parser", () => {
    const parser = sequenceOf([
        digits,
        letters,
        digits,
    ]);
    const result = parser.run("123abc45");
    expect(result).toMatchObject({
        error: null,
        index: 8,
        isError: false,
        result: ["123","abc","45"],
        targetString: "123abc45"
    })
})

test("choice parser", () => {
    const parser = choice([
        letters,
        digits,
    ]);
    const result = parser.run("123abc45");
    expect(result).toMatchObject({
        error: null,
        index: 3,
        isError: false,
        result: "123",
        targetString: "123abc45"
    })
})

test("many parser with choice", () => {
    const parser = many(choice([
        digits,
        letters
    ]));
    const result = parser.run("123abc45");
    expect(result).toMatchObject({
        error: null,
        index: 8,
        isError: false,
        result: ["123", "abc", "45"],
        targetString: "123abc45"
    })
})

test("between parser", () => {
    const brackets = between(str('('), str(')'));
    const parser = brackets(letters);
    const result = parser.run("(hoohoo)");

    console.log(result);
    
    expect(result).toMatchObject({
        targetString: '(hoohoo)',
        index: 8,
        result: 'hoohoo',
        isError: false,
        error: null
    })

})

