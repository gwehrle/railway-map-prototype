const getWaysWithNode = (node, elements) => {
    return elements.filter(element => element.type === "way" && element.nodes.includes(node.id));
}

const openJOSM = async (bbox: any, nodeId: number) => {
    const josmUrl = new URL("http://127.0.0.1:8111");

    josmUrl.pathname = "/load_and_zoom";
    josmUrl.searchParams.append("left", bbox.getWest());
    josmUrl.searchParams.append("top", bbox.getNorth());
    josmUrl.searchParams.append("right", bbox.getEast());
    josmUrl.searchParams.append("bottom", bbox.getSouth());

    josmUrl.searchParams.append("select",`node${nodeId}`)


    try {
        await fetch(josmUrl)
    } catch (e) {
        alert("Ist JOSM gestartet?");
    }
}

export {
    getWaysWithNode,
    openJOSM
}