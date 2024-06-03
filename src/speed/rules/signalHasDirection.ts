const rule = {
    glyph: "<->",
    errorMessage: "No direction or wrong defined",
    valid: (signal, parentWays) => {
        const direction = signal.tags["railway:signal:direction"].toLowerCase()
        return ["forward", "backward"].includes(direction);
    }
}

export default rule;