const rule = {
    glyph: "⚠",
    errorMessage: "Signal is between two starting or two ending points of ways.",
    valid: (signal, parentWays) => {
        // Skip when signal not between two ways
        if (parentWays.length !== 2)
            return null;

        const { id } = signal;
        const way1Nodes = parentWays[0].nodes;
        const way2Nodes = parentWays[1].nodes;

        // Signal is at the end of way2 and at the start of way1
        if (way1Nodes.indexOf(id) < way2Nodes.indexOf(id)) {
            return way1Nodes.indexOf(id) === 0 && way2Nodes.indexOf(id) === way2Nodes.length - 1;
        }

        // Signal is at the end of way1 and at the start of way2
        return way2Nodes.indexOf(id) === 0 && way1Nodes.indexOf(id) === way1Nodes.length - 1;
    }
}

export default rule;
