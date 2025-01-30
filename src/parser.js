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

const str = s => parserState => {
    const {targetString, index, isError} = parserState;

    if(isError) {
        return parserState;
    }
    if(targetString.slice(index).startsWith(s)){
        return updateParserState(parserState, index + s.length, s);
    }

    //handle error
    return updateParserError(parserState, `Trying to match ${s}, got "${targetString}"`);
    
}

const sequenceOf = parsers => parserState => {
    const results = [];
    let nextState = parserState;

    for (let p of parsers) {
       nextState = p(nextState);
        results.push(nextState.result);
    }

    return updateParserResult(nextState, results);
}

const run =(parser, targetString) => {
    const initialState = {
        targetString,
        index: 0,
        result: null,
        isError: false,
        error:null,
    }
    return parser(initialState);
}

module.exports ={
    run,
    sequenceOf,
    str
}




