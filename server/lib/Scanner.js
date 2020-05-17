const Stream = require("./Stream");
const Token = require("./Token");
const LexicalToken = require("./LexicalToken");

class Scanner {
    constructor(input) {
        this.stream = new Stream(input);
        this.keywords = new Set(["s", "r", "i"]);
        this.lineCount = 1;
        this.colCount = -1;
        this.needToken = true;
        this.lastToken = null;
    }

    putBackToken() {
        this.needToken = false;
    }

    getToken() {
        if (!this.needToken) {
            this.needToken = true;
            return this.lastToken;
        }

        let state = 0;
        let foundOne = false;
        let c = this.stream.getC().toLowerCase();
        let type = null;
        let column = 0;
        let line = 0;

        if (this.stream.eof()) {
            this.lastToken = new Token("EOF", this.lineCount, this.colCount);
            return this.lastToken;
        }

        let lex = "";

        while (!foundOne) {
            this.colCount += 1;
            
            switch (state) {
                case 0:
                    lex = "";
                    column = this.colCount;
                    line = this.lineCount;

                    if (this.isLetter(c)) state = 1;
                    else if (this.isNumber(c)) state = 2;
                    else if (c === "+") state = 3;
                    else if (c === "-") state = 4;
                    else if (c === "*") state = 5;
                    else if (c === "/") state = 6;
                    else if (c === "(") state = 7;
                    else if (c === ")") state = 8;
                    //TODO check for newline
                    else if (this.isWhitespace(c)) state = state;
                    else if (this.stream.eof()) {
                        foundOne = true;
                        type = "EOF";
                    }
                    else {
                        throw `Unrecognized token found at line ${line}, column ${column}`
                    }
                    break;
                case 1:
                    if (this.isLetter(c) || this.isNumber(c)) state = 1;
                    else {
                        if (this.keywords.has(lex.trim())) {
                            foundOne = true;
                            type = "keyword";                         
                        } else {
                            foundOne = true;
                            type = "identifier";
                        }
                    }
                    break;
                case 2:
                    if (this.isNumber(c)) state = 2;
                    else {
                        type = "number";
                        foundOne = true;                        
                    }
                    break;
                case 3:
                    type = "add";
                    foundOne = true;
                    break;
                case 4:
                    type = "sub";
                    foundOne = true;
                    break;
                case 5:
                    type = "times";
                    foundOne = true;
                    break;
                case 6:
                    type = "divide";
                    foundOne = true;
                    break;
                case 7:
                    type = "lparen";
                    foundOne = true;
                    break;
                case 8:
                    type = "rparen";
                    foundOne = true;
                    break;
            }

            if (!foundOne) {                
                lex = lex + c;
                c = this.stream.getC();                  
            }
        }

        this.stream.ungetC();
        this.colCount--;
        let t = null;

        if (type === "number" || type === "identifier" || type === "keyword") {
            t = new LexicalToken(type, line, column, lex.trim());
        } else {
            t = new Token(type, line, column);
        }

        this.lastToken = t;
        return t;
    }

    isLetter(c) {
        return c.toLowerCase() != c.toUpperCase();
    }

    isNumber(c) {
        if (c === " ") return false;
        return !isNaN(c);
    }

    isWhitespace(c) {
        return (c === " ") || (c === '\t') || (c === '\n');
    }
}

module.exports = Scanner;