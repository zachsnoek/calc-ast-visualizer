const server = "https://sleepy-bastion-65288.herokuapp.com/evaluate";
const resultText = document.getElementById("result");
const container = document.getElementById("network");
const stepThroughButton = document.getElementById("step-through");
const prevStepButton = document.getElementById("prev-step");
const nextStepButton = document.getElementById("next-step");
const resultContainer = document.getElementById("display-result");
const tokens = /[0-9\(\)\+\-\*\/]/g;
let stepper = null;

resetVisibility();

/**
 * Validates the expression input.
 */
function inputValid() {
    const input = document.getElementById("expression").value
                    .replace(/\s/g, '');
    const matches = input.match(tokens);

    return matches != null && input.length === matches.length;
}

/**
 * Validates the expression input and sends it to
 * the server.
 */
function getAST() {
    if (!inputValid()) {
        alert("Your expression contains characters not accepted by the language. Please enter a valid expression.");
        return;
    }

    data = {
        expression: document.getElementById("expression").value
    };

    resetVisibility();

    fetch(server, {
        method: "POST",
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify(data)
    })
        .then(res => res.json())
        .then(data => {
            if (data.success != true) {
                console.log(data.error);
                alert("Error getting data from server.");
            } else {
                displayAST(data);
            }
        });
}

/**
 * Displays the AST from the metadata retrieved from the server.
 * 
 * @param {*} data The data retrieved from the server.
 */
function displayAST(data) {
    const { result, metadata } = data.data;
    const { nodes, edges } = metadata;
    
    setResultText(result);
    createTree(nodes, edges);

    stepper = new Stepper(nodes, edges);
    resultContainer.classList.remove("hidden");

    if (stepper.nodes.length > 1) {
        stepThroughButton.classList.remove("hidden");
    }
}

/**
 * Sets the text of the result.
 * 
 * @param {String} result The text to display.
 */
function setResultText(result) {
    resultText.textContent = result;
}

/**
 * Sets the visibility of step control buttons and the
 * result text.
 */
function resetVisibility() {
    nextStepButton.classList.add("hidden");
    prevStepButton.classList.add("hidden");
    stepThroughButton.classList.add("hidden");
    resultContainer.classList.add("hidden");
}

/**
 * Creates a tree and displays it.
 * 
 * @param {Array} n The nodes of the tree.
 * @param {Array} e The edges of the tree.
 */
function createTree(n, e) {
    const nodes = new vis.DataSet(n);
    const edges = new vis.DataSet(e);

    const tree = {
        nodes: nodes,
        edges: edges
    };

    const options = {
        nodes: {
            font: {
                size: 22
            },
            shape: "box",
            shapeProperties: {
                borderRadius: 100
            },
            color: {
                background: "#ff6666",
                border: "#ff6666",
            },
            font: {
                align: "center",
                color: "#FFF"
            },
            widthConstraint: {
                minimum: 50
            },
            heightConstraint: {
                minimum: 50
            }
        },
        edges: {
            width: 3
        },
        layout: {
            hierarchical: {
                sortMethod: "directed"
            }
        }
    };

    const network = new vis.Network(container, tree, options);
}

/**
 * Starts stepping through the AST.
 */
function stepThrough() {
    if (stepper != null) {
        nextStep();
        stepThroughButton.classList.add("hidden");
        nextStepButton.classList.remove("hidden");
    }
}

/**
 * Runs the next step of the AST traversal.
 */
function nextStep() {
    stepper.nextStep();
    createTreeFromStepper();

    if (stepper.hasPrevStep()) {
        prevStepButton.classList.remove("hidden");
    }

    if (!stepper.hasNextStep()) {
        stepper.reset();
        stepThroughButton.classList.remove("hidden");
        nextStepButton.classList.add("hidden");
        prevStepButton.classList.add("hidden");
    }
}

/**
 * Runs the previous step of the AST traversal.
 */
function prevStep() {
    stepper.prevStep();
    createTreeFromStepper();

    if (!stepper.hasPrevStep()) {
        prevStepButton.classList.add("hidden");
    }
}

/**
 * Helper function that gets the tree data from the current step
 * and calls `createTree()`.
 */
function createTreeFromStepper() {
    const { nodes, edges } = stepper.getStepData();
    createTree(nodes, edges);
}