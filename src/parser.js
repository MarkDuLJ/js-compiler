const { Tokenizer } = require('./tokenizer');

class Parser {
    /**
     * initialize parser
     */
    constructor() {
        this._string = '';
        this._tokenizer = new Tokenizer();
    }
    /**
     * Parses a string to AST
     */
    parse(string) {
        this._string = string;
        this._tokenizer.init(string);

        this._lookahead = this._tokenizer.getNextToken();
        return this.Program();
    }

    /**
     * Main entry point
     * 
     * Program
     *  :Literal
     */
    Program(){
        return {
            type: "Program",
            body:this.literal()
        };
    }

    /**
     * Literal
     *     :NumericLiteral
     *     :StringLiteral
     */
    literal() {
        switch (this._lookahead.type) {
            case 'NUMBER': return this.numericLiteral();
            case 'STRING': return this.stringLiteral()
            default:
                throw new SyntaxError("Literal: unexpected literal");
        }
    }

    /**
     * numericLiteral
     *  :NUMBER
     */
    numericLiteral() {
        const token = this._eat('NUMBER')
        return {
                type: 'NumericLiteral',
                value: Number(token.value)
            };
    }
    
    /**
     * StringLiteral
     *  :STRING
    */
   stringLiteral(){
        const token = this._eat('STRING')
        return {
                type: 'StringLiteral',
                value: token.value.slice(1,-1) //remove " both side
            };
    }
    

    /**
     * Expects a token of given type
     */
    _eat(tokenType) {
        const token = this._lookahead;

        if(token == null){
            throw new SyntaxError(
                `Unexpected end of input, expected: ${tokenType}`,
            )
        };

        if (token.type !== tokenType) {
            throw new SyntaxError(
                `Unexpected token: ${token.value}, expected: ${tokenType}`
            );           
        }

        //get next token, update lookahead
        this._lookahead = this._tokenizer.getNextToken();

        return token;
    }
}

module.exports = {
    Parser
}