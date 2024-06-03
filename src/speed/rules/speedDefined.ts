const rule = {
    glyph: "?",
    errorMessage: "Speed undefined",
    valid: (signal, parentWays) => {
        const speeds= signal.tags["railway:signal:speed_limit:speed"];

        if (!speeds)
            return false;

        const speedlist = speeds.split(";");

        if (speedlist.length == 0)
            return false;

        if (speedlist.includes("?"))
            return false;

        for (const speed of speedlist) {
            if (speed == "off")
                continue;

            if (parseInt(speed).toString() !== speed)
                return false;
        }
        
        return true;
    }
}

export default rule;
