class Stepper {
    constructor(nodes, edges) {
        this.nodes = nodes;
        this.edges = edges;
        this.started = false;
        this.step = 1;
    }

    hasNextStep() {
        return !(this.step > this.nodes.length);
    }

    nextStep() {
        if (this.hasNextStep()) {
            // Get the node with ID of this.step
            const nodes = this.nodes.filter(n => n.id <= this.step);

            // Find any edges that have a "from" property of this.step
            const edges = this.edges.filter(e => e.from <= this.step);
            this.step++;

            return { nodes, edges };
        }
    }

    reset() {
        this.step = 1;
    }
}