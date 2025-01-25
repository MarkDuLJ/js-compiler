class Parser {
    /**
     * Parses a string to AST
     */
    parse(string) {
        this._string = string;
        return this.Program();
    }

    /**
     * Main entry point
     * 
     * Program
     *  :NumericLiteral
     */
    Program(){
        return this.numericLiteral();
    }

    /**
     * numericLiteral
     *  :NUMBER
     */
    numericLiteral() {
        return {
            type: "Program",
            body: {
                type: 'NumericLiteral',
                value: Number(this._string)
            }
        }
    }
}

module.exports = {
    Parser
}