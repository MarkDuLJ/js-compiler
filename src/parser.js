const updateParserState = (state, index, result) => ({
    ...state,
    index,
    result,
})

const updateParserResult = (state, result) => ({
    ...state,
    result,
})

const updateParserError = (state, errorMsg) => ({
    ...state,
    isError: true,
    error: errorMsg
})

class Parser {
    constructor(parserStateTransFn){
        this.parserStateTransFn = parserStateTransFn;
    }

    run(targetString) {
        const initialState = {
            targetString,
            index: 0,
            result: null,
            isError: false,
            error:null,
        }
        return this.parserStateTransFn(initialState);
    }

    map(fn) {
       return new Parser(parserState => {
            const nextState = this.parserStateTransFn(parserState);

            if (nextState.isError) return nextState;
            return updateParserResult(nextState, fn(nextState.result))
        })
    }

    //full version of map function
    chain(fn) {
       return new Parser(parserState => {
        const nextState = this.parserStateTransFn(parserState);
        if(nextState.isError) return nextState;

        //use fn to get next parser, that's why call it chain
        const nextParser = fn(nextState.result);

        return nextParser.parserStateTransFn(nextState);
       }); 
    }

    errorMap(fn) {
        return new Parser(parserState => {
            const nextState = this.parserStateTransFn(parserState);

            if( !nextState.isError) return nextState;

            return updateParserError(nextState, fn(nextState.error, nextState.index));
        })
    }
}

const str = s => new Parser(parserState => {
    const {targetString, index, isError} = parserState;

    if(isError) {
        return parserState;
    }

    const slicedTarget = targetString.slice(index);
    if (slicedTarget.length === 0) {
        return updateParserError(parserState, `STRING: matching "${s}", but end of input`);
    }
    if(slicedTarget.startsWith(s)){
        return updateParserState(parserState, index + s.length, s);
    }

    //handle error
    return updateParserError(parserState, `Trying to match ${s}, got "${targetString}"`);
    
})

const letterRegex = /^[a-zA-Z]+/;
const digitRegex = /^[0-9]+/;

const letters = new Parser(parserState => {
    const {targetString, index, isError} = parserState;

    if(isError) {
        return parserState;
    }

    const slicedTarget = targetString.slice(index);
    if (slicedTarget.length === 0) {
        return updateParserError(parserState, `Letter: end of input`);
    }

    const matched = slicedTarget.match(letterRegex);
    if(matched){
        return updateParserState(parserState, index + matched[0].length, matched[0]);
    }

    //handle error
    return updateParserError(parserState, `Letter:Trying to match at index ${index}`);
    
})

const digits = new Parser(parserState => {
    const {targetString, index, isError} = parserState;

    if(isError) {
        return parserState;
    }

    const slicedTarget = targetString.slice(index);
    if (slicedTarget.length === 0) {
        return updateParserError(parserState, `Letter: end of input`);
    }

    const matched = slicedTarget.match(digitRegex);
    if(matched){
        return updateParserState(parserState, index + matched[0].length, matched[0]);
    }

    //handle error
    return updateParserError(parserState, `Letter:Trying to match at index ${index}`);
    
})

const sequenceOf = parsers => new Parser(parserState => {
    const results = [];
    let nextState = parserState;

    for (let p of parsers) {
       nextState = p.parserStateTransFn(nextState);
        results.push(nextState.result);
    }

    return updateParserResult(nextState, results);
})

const choice = parsers => new Parser(parserState => {
    if(parserState.isError) return parserState;

    for (let p of parsers) {
      const nextState = p.parserStateTransFn(parserState);
        if(!nextState.isError){
            return nextState;
        }
    }

    return updateParserError(parserState, `Choice: no match parser at index ${parserState.index}.`);
})

const many = parser => new Parser(parserState => {
    if(parserState.isError) return parserState;

    let done = false;
    const results = [];
    let nextState = parserState;
    while(!done){
        let testState = parser.parserStateTransFn(nextState);
        if(!testState.isError){
            results.push(testState.result);
            nextState = testState;
        }else{
            done = true;
        }
    }
//not deal with error becuase if no matching, empty array returns
    return updateParserResult(nextState, results);
})

const manyOne = parser => new Parser(parserState => {
    if(parserState.isError) return parserState;

    let done = false;
    const results = [];
    let nextState = parserState;
    while(!done){
        nextState = parser.parserStateTransFn(nextState);
        if(!nextState.isError){
            results.push(nextState.result);
        }else{
            done = true;
        }
    }
//check results to make sure at least one result return.
    if(results.length > 0) {
        return updateParserResult(nextState, results);
    } else {
        return updateParserError(parserState, `ManyOne: unable to find matching at index ${parserState.index}`)
    }

})

const between = (leftparser, rightparser) => contentparser => sequenceOf([
    leftparser,
    contentparser,
    rightparser,
]).map(results => results[1]);

const separateBy = separatorParser => valueParser => new Parser(parserState => {
    const results = [];
    let nextState = parserState;
    while(true){
        const desiredState = valueParser.parserStateTransFn(nextState);
        if (desiredState.isError) break;

        results.push(desiredState.result);
        nextState = desiredState;

        const separatorState = separatorParser.parserStateTransFn(nextState);
        if (separatorState.isError) break;

        nextState = separatorState;
    }

    return updateParserResult(nextState, results);
});

//return at least one value
const separateByOne = separatorParser => valueParser => new Parser(parserState => {
    const results = [];
    let nextState = parserState;
    while(true){
        const desiredState = valueParser.parserStateTransFn(nextState);
        if (desiredState.isError) break;

        results.push(desiredState.result);
        nextState = desiredState;

        const separatorState = separatorParser.parserStateTransFn(nextState);
        if (separatorState.isError) break;

        nextState = separatorState;
    }

    if(results.length === 0) {
        return updateParserError(parserState, `SeparateByOne: unable to find value @ index ${parserState.index}`);
    }
    return updateParserResult(nextState, results);
});

const lazy = parserThunk => new Parser(parserState => {
    const parser = parserThunk();
    return parser.parserStateTransFn(parserState);
});


const operatorParser = choice([
    str('+'),
    str('-'),
    str('*'),
    str('/'),
]);

const betweenParenthese = between(
    str('('),
    str(')')
);

module.exports ={
    sequenceOf,
    str,
    letters,
    digits,
    choice,
    many,
    manyOne,
    between,
    separateBy,
    separateByOne,
    lazy,
    betweenParenthese,
    operatorParser,
}




