const str = s => parserState => {
    const {targetString, index} = parserState;

    if(targetString.slice(index).startsWith(s)){
        return {
            ...parserState,
            result: s,
            index: index + s.length,
        }
    }

    throw new Error(`Trying to match ${s}, got "${targetString}"`);
    
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
    }
    return parser(initialState);
}

module.exports ={
    run,
    sequenceOf,
    str
}




