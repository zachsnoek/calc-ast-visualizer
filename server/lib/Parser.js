const Scanner = require("./Scanner");
const { AddNode, SubNode, MulNode, DivNode, NumNode, StoreNode, RecallNode } = require('./Nodes');

class Parser {
    constructor(input) {
        this.scan = new Scanner(input);
    }

    parse() {
        return this.Prog();
    }

    Prog() {
        const result = this.Expr();
        const t = this.scan.getToken();

        if (t.type != "EOF") {
            throw `Unexpected EOF. Found ${t.type}.`;
        }

        return result;
    }

    Expr() {
        return this.RestExpr(this.Term());
    }

    RestExpr(e) {
        const t = this.scan.getToken();

        if (t.type === "add") {
            return this.RestExpr(new AddNode(e, this.Term()));
        }

        if (t.type === "sub") {
            return this.RestExpr(new SubNode(e, this.Term()));
        }

        this.scan.putBackToken();

        return e;
    }

    Term() {
        return this.RestTerm(this.Storable());
    }

    RestTerm(e) {
        const t = this.scan.getToken();

        if (t.type === "times") {
            return this.RestTerm(new MulNode(e, this.Storable()));
        }

        if (t.type === "divide") {
            return this.RestTerm(new DivNode(e, this.Storable()));
        }

        this.scan.putBackToken();

        return e;
    }

    Storable() {
        const subtree = this.Factor();
        const nextToken = this.scan.getToken();

        if (nextToken.type === "keyword") {
            if (nextToken.lex === "s") {
                return new StoreNode(subtree);
            }
            throw "Parse Error";
        }

        this.scan.putBackToken();

        return subtree;
    }

    Factor() {
        const t = this.scan.getToken();

        if (t.type === "number") {
            return new NumNode(Number(t.lex));
        }

        if (t.type === "keyword") {
            switch (t.lex) {
                case "r":
                    return new RecallNode();
                default:
                    throw "Unknown keyword";
            }
        }

        if (t.type === "lparen") {
            const expr = this.Expr();
            const nextToken = this.scan.getToken();

            if (nextToken.type != "rparen") {
                throw "Expected RPAREN";
            }
            return expr;
        }

        throw "Parse Error";
    }
}

module.exports = Parser;