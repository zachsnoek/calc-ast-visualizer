const Parser = require("./Parser");

class Calculator {
    eval(expr) {
        const parser = new Parser(expr);
        const ast = parser.parse();
        const result = ast.evaluate();
        const metadata = ast.meta(1, [], []);

        return { ast, result, metadata };
    }
}

module.exports = Calculator;