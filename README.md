# Calc AST Visualizer
[Demo]()

## Description
Calc AST Visualizer is a tool to visualize the abstract syntax tree (AST) generated from a simple calculator language. The Calc language and interpreter are from Kent D. Lee's "Programming Languages: An Active Learning Approach." The original Calc interpreter was ported from C++/Ruby to JavaScript for use in this project.

## Installation (server)
```bash
$ cd server
$ npm i
$ npm run start
```

## Data Flow
1. The user enters a Calc expression in the client.
2. The server runs the Calc interpreter, evaluates the expression, and generates the metadata for the front-end visualization library to use.
3. The server sends the expression's result and AST metadata to the client.
4. The client displays the result and AST.

## Grammar
The grammar for Calc is LL(1). Expressions are evaluated and AST metadata are generated using a recursive descent.

```
Prog     -> Expr EOF
Expr     -> Term RestExpr
RestExpr -> + Term RestExpr | - Term RestExpr | <null>
Term     -> Storable RestTerm
RestTerm -> * Storable RestTerm | / Storable RestTerm | <null>
Storable -> Factor S | Factor
Factor   -> digit | R | (Expr)
```

### Tokens
The tokens accepted by the Calc interpreter can be described by the regular expression `/[0-9\(\)\+\-\*\/]/`.

## Notes
* The S and R keywords in the grammar are not yet implemented
* The interpreter cannot handle all errors currently, so error handling is weak in both the client and server

## Future Work
* Improve parser
* Implement S and R keywords