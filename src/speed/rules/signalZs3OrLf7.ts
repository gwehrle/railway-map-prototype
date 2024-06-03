const rule = {
    glyph: "?",
    errorMessage: "Unknown or missing speed_limit type",
    valid: (signal, parentWays) => {
        const type = signal.tags["railway:signal:speed_limit"].toLowerCase()
        if (type == "de-eso:zs3")
            return true;

        if (type == "de-eso:lf7")
            return true;

        return false
    }
}

export default rule;