const rule = {
    glyph: "✂",
    errorMessage: "Signal is contained by a way. <br> The way should be split.",
    valid: (signal, parentWays) => {
        if (signal.tags["railway:signal:speed_limit"].toLowerCase() == "de-eso:zs3")
            return true;
        // TODO test if before and after is the same maximum velocity (most unlikely)
        return parentWays.length == 2;
    }
}

export default rule;
