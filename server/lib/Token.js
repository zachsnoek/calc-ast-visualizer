class Token {
    constructor(type, line, col) {
        this.type = type;
        this.line = line;
        this.col = col;
    }
}

module.exports = Token;