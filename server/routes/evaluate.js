const router = require("express").Router();
const Calculator = require("../lib/Calculator");

router.post("/", (req, res) => {
    const expr = req.body.expression;
    const calc = new Calculator();

    console.log("Evaluating expression: " + expr);

    try {
        const { ast, result, metadata } = calc.eval(expr);  

        res.status(201).json({
            success: true,
            data: { result, metadata } 
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err
        });
    }
});

module.exports = router;