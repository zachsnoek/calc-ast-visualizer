const Token = require("./Token");

class LexicalToken extends Token {
    constructor(type, line, col, lex) {
        super(type, line, col);
        this.lex = lex;
    }
}

module.exports = LexicalToken