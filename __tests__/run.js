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
    separateBy,
    lazy,
    betweenParenthese,
    operatorParser,
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
    
    expect(result).toMatchObject({
        targetString: '(hoohoo)',
        index: 8,
        result: 'hoohoo',
        isError: false,
        error: null
    })

})

/**
 * try to parse string like below
 * "string:hey"
 * "number:33"
 * "diceroll:2d9"
 */
test("use parser combination", () => {
    const stringResult = {type:"string", value: "hey"};
    const numberResult = {type:"number", value: "33"};
    const diceResult = {type:"diceroll", value: [2,9]};

    const stringParser = letters.map(result => ({
        type:"string",
        value:result
    }));

    const numberParser = digits.map(result => ({
        type:"number",
        value:Number(result)
    }));

    const dicerollParser = sequenceOf([
        digits,
        str('d'),
        digits
    ]).map((results) => ({
        type:"diceroll",
        value:[Number(results[0]), Number(results[2])]
    }));

    const parser = sequenceOf([
        letters,
        str(':')
    ]).map(results => results[0])
    .chain(type => {
        if(type === 'string'){
            return stringParser;
        }else if(type === 'number') {
            return numberParser
        }

        return dicerollParser; // suppose only 3 kind of parsers
    })

    const result = parser.run("diceroll:2d9");

    expect(result).toMatchObject({
        targetString: 'diceroll:2d9',
        index: 12,
        result: diceResult,
        isError: false,
        error: null
    })
})

// parse [1,[2,[3], 4], 5]
test("recursive parser", ()=>{
    const betweenBricket = between(str('['), str(']'));
    const commaSeparated = separateBy(str(','));
    const value =lazy(() => choice([
        digits,
        arrayParser,
    ]));
    const arrayParser = betweenBricket(commaSeparated(value));
    const result = arrayParser.run("[1,[2,[3],4],5]");

    expect(result).toMatchObject({
        error: null,
        result: [ '1', [ '2', ['3'], '4' ], '5' ]
    })
})

// calculate (+ 10 2) or (+ (* 2 3) (/ 8 4))
test("calculation parser", ()=> {
    const numberParser = digits.map(n=>({
        type:'number',
        value: Number(n)
    }));

    const whitespaceParser = manyOne(str(' '));

    const expr = lazy(() => choice([
        numberParser,
        calParser,
    ]));

const calParser = betweenParenthese(sequenceOf([
    operatorParser,
    // whitespaceParser,
    str(' '),
    expr,
    // whitespaceParser,
    str(' '),
    expr,
])).map(results => ({
    type:'operation',
    value: {
        op: results[0],
        a: results[2],
        b: results[4],
    }
}));

    const result = expr.run('(+ 1 2)');
    // const result = calParser.run('(+ (* 2 3) (- (/ 8 4) 2))');

    console.log(JSON.stringify(result, null, 2));

    expect(result).toMatchObject({
        error:null,
        result: {
            "type": "operation",
            "value": {
              "op": "+",
              "a": {
                "type": "number",
                "value": 1
              },
              "b": {
                "type": "number",
                "value": 2
              }
            }
        }            
    });
})
