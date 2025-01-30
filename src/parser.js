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

            return updateParserResult(nextState, fn(nextState.result))
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

const sequenceOf = parsers => new Parser(parserState => {
    const results = [];
    let nextState = parserState;

    for (let p of parsers) {
       nextState = p.parserStateTransFn(nextState);
        results.push(nextState.result);
    }

    return updateParserResult(nextState, results);
})



module.exports ={
    sequenceOf,
    str
}




