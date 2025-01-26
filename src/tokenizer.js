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
        if (!isNaN(str[0])) {
            let number = '';
            while (!Number.isNaN(Number(str[this._cursor]))) {
                number += str[this._cursor++];
            }
            return {
                type: "NUMBER",
                value: number
            };
        }

        //String
        if(str[0] === '"') {
            let s = '';
            do {
                s += str[this._cursor++];
            }
            while (str[this._cursor] !== '"' && !this.isEof());
            s += str[this._cursor++];           

            return {
                type: "STRING",
                value: s,
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