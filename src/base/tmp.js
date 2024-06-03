marker.on('click', (e) => {
    const latlngsToNextSignal = (way, nodeId, startIndex = 0) => {
        const waynodes = way.nodes;
        const waygeo = way.geometry;
        let reversed = false;

        // Reverse way with wrong direction
        // ●<––––○ 🠲 ●––––>○
        // ○––––>● 🠲 ○<––––●
        if (nodeId !== waynodes.at(startIndex) && nodeId == waynodes.at(waynodes.length - startIndex - 1)) {
            waynodes.reverse();
            waygeo.reverse();
            reversed = true;
        }

        // Check if way contains matching signal
        for (let index=startIndex; index < waynodes.length; i++) {
            const nodeId = waynodes[index];

            if (nodeId == nodeId)
                continue;

            latlngs.push(waygeo[index]);

            for (const signal of signals) {
                if (signal.id != nodeId)
                    continue;

                const signalDirection = signal.tags["railway:signal:direction"];
                if (signalDirection == "both" || (!reversed == (signalDirection == "forward")))
                    return;
            }
        }

        // Get Endnode from current way
        // ●––––>○ 🠲 ○––––>●
        const endNodeId = waynodes.at(-1);

        // Start colorWays for all ways with endNode
        for (const nextWay of ways) {
            if (nextWay.nodes.includes(endNodeId) && nextWay !== way)
                latlngsToNextSignal(latlngs, nextWay, endNodeId);
        }
    }

    console.log(e);

    

    const ways = []; // TODO
    const signals = []; // TODO

    const signal;
    const direction = signal.tags["railway:signal:direction"];

    if (direction == "forward") {
        startIndex = way.nodes.indexOf(signal);
    } else if (direction == "backward") {
        startIndex = way.nodes.length - way.nodes.indexOf(signal);
    }

    const latlngs = latlngsToNextSignal(way, signal.id, startIndex);
});