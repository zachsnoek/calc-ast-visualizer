const Calculator = require("./Calculator");

/* PARENT NODES */

/**
 * A node with one subtree.
 */
class UnaryNode {
    /**
     * Creates a UnaryNode.
     * 
     * @param {*} subtree The subtree to store in the node.
     */
    constructor(subtree) {
        this.subtree = subtree;
    }
}

/**
 * A node with two subtrees.
 */
class BinaryNode {
    /**
     * Creates a binary node.
     * 
     * @param {*} left The left subtree.
     * @param {*} right The right subtree.
     * @param {String} label The label of the node to be given in the node's metadata.
     */
    constructor(left, right, label) {
        this.left = left;
        this.right = right;
        this.label = label;
    }

    /**
     * Creates the metadata of the AST to be used with a visualization library.
     * The first call should be supplied with a starting ID and two empty arrays.
     * 
     * @param {String} id The id of the next node.
     * @param {Array} nodes An array of nodes.
     * @param {Array} edges An array of edges.
     */
    meta(id, nodes, edges) {
        const { id: id1, nodes: nodes1, edges: edges1 } = this.left.meta(id, nodes, edges);
        const { id: id2, nodes: nodes2, edges: edges2 } = this.right.meta(id1, nodes1, edges1);
        
        nodes2.push({ id: id2, label: this.label });
        edges2.push({ from: id2, to: id1 - 1 }, { from: id2, to: id2 - 1 });

        return {
            id: id2 + 1,
            nodes: nodes2,
            edges: edges2
        }
    }
}

/* CHILD NODES */

/**
 * An addition node. Evaluation computes the left and right
 * subtrees and returns their sum.
 */
class AddNode extends BinaryNode {
    constructor(left, right) {
        super(left, right, "+");
    }

    evaluate() {
        let l = this.left.evaluate();
        let r = this.right.evaluate();

        return l + r;
    }

    meta(id, nodes, edges) {
        return super.meta(id, nodes, edges);
    }
}

/**
 * A subtraction node. Evaluation computes the left and right
 * subtrees and returns their difference.
 */
class SubNode extends BinaryNode {
    constructor(left, right) {
        super(left, right, "-");
    }

    evaluate() {
        let l = this.left.evaluate();
        let r = this.right.evaluate();

        return l - r;
    }

    meta(id, nodes, edges) {
        return super.meta(id, nodes, edges);
    }
}

/**
 * A multiplication node. Evaluation computes the left and right
 * subtrees and returns their product.
 */
class MulNode extends BinaryNode {
    constructor(left, right) {
        super(left, right, "*");
    }

    evaluate() {
        let l = this.left.evaluate();
        let r = this.right.evaluate();

        return l * r;
    }

    meta(id, nodes, edges) {
        return super.meta(id, nodes, edges);
    }
}

/**
 * A division node. Evaluation computes the left and right
 * subtrees and returns their quotient.
 */
class DivNode extends BinaryNode {
    constructor(left, right) {
        super(left, right, "-");
    }

    evaluate() {
        let l = this.left.evaluate();
        let r = this.right.evaluate();

        return l / r;
    }

    meta(id, nodes, edges) {
        return super.meta(id, nodes, edges);
    }
}

/**
 * A number node. Evaluation returns the number stored.
 */
class NumNode {
    constructor(num) {
        this.num = num;
    }

    evaluate() {
        return this.num;
    }

    meta(id, nodes, edges) {
        nodes.push({ id, label: String(this.num) });
        id = id + 1;

        return { id, nodes, edges };
    }
}

class StoreNode extends UnaryNode {
    constructor(subtree) {
        super(subtree);
    }

    evaluate() {
        const subResult = this.subtree.evaluate();
        Calculator.memory = subResult;

        return subResult;
    }
}

class RecallNode extends UnaryNode {
    evaluate() {
        return Calculator.memory;
    }
}

module.exports = {
    AddNode,
    SubNode,
    MulNode,
    DivNode,
    NumNode,
    StoreNode,
    RecallNode
}