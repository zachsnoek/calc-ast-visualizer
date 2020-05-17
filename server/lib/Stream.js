class Stream {
    constructor(input) {
        this.input = input.trim();
        this.index = 0;
        this.length = input.length;
    }

    getC() {
        if (!this.eof()) {
            let c = this.input.charAt(this.index);
            this.index++;
            
            return c;
        }

        return "eof";
    }

    ungetC() {
        this.index--;
    }

    eof() {
        return this.index > this.length;
    }
}

module.exports = Stream;