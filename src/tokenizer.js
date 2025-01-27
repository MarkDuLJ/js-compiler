class Tokenizer {
    init(string) {
        this._string = string;
        this._cursor = 0;
    }

    /**
     * tokenizer reachs the end of file
     */
    isEof() {
        return this._cursor === this._string.length;
    }

    getNextToken(){
        if (!this.hasMoreTokens()){
            return null;
        }

        const str = this._string.slice(this._cursor);

        //Numbers:
        let matched = /^\d+/.exec(str);
        if (matched !== null) {
            this._cursor += matched[0].length;
            // let number = '';
            // while (!Number.isNaN(Number(str[this._cursor]))) {
            //     number += str[this._cursor++];
            // }
            return {
                type: "NUMBER",
                value: matched[0]
            };
        }

        //String
        matched = /"[^"]*"/.exec(str); //anything but " inside ""
        if(matched !== null) {
            this._cursor += matched[0].length;
            // let s = '';
            // do {
            //     s += str[this._cursor++];
            // }
            // while (str[this._cursor] !== '"' && !this.isEof());
            // s += str[this._cursor++];           

            return {
                type: "STRING",
                value: matched[0],
            }
        }

        // add single quote support '
        matched = /^'[^']*'/.exec(str);
        if(matched !== null) {
            this._cursor += matched[0].length;
            return {
                type:"STRING",
                value: matched[0],
            }
        }
        return null;
    }

    hasMoreTokens(){
        return this._cursor < this._string.length;
    }
}

module.exports = {
    Tokenizer
}