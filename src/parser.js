const str = s => parserState => {
    const {targetString, index, isError} = parserState;

    if(isError) {
        return parserState;
    }
    if(targetString.slice(index).startsWith(s)){
        return {
            ...parserState,
            result: s,
            index: index + s.length,
        }
    }

    //handle error
    return {
        ...parserState,
        error: `Trying to match ${s}, got "${targetString}"`,
        isError: true,
    }
    
}

const sequenceOf = parsers => parserState => {
    const results = [];
    let nextState = parserState;

    for (let p of parsers) {
       nextState = p(nextState);
        results.push(nextState.result);
    }

    return {
        ...nextState,
        result: results,
    }
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




