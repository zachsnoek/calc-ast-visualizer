/**
 * A helper class to run through a postorder traversal of an AST.
 */
class Stepper {
    constructor(nodes, edges) {
        this.nodes = nodes;
        this.edges = edges;
        this.step = 0;
    }

    hasPrevStep() {
        return this.step > 1;
    }

    hasNextStep() {
        return !(this.step === this.nodes.length);
    }

    prevStep() {
        this.step--;
    }

    nextStep() {
        this.step++;
    }

    getStepData() {
        // Get any nodes that have an id property <= this.step
        const nodes = this.nodes.filter(n => n.id <= this.step);

        // Get any edges that have a from property <= this.step
        const edges = this.edges.filter(e => e.from <= this.step);

        return { nodes, edges };
    }

    reset() {
        this.step = 0;
    }
}