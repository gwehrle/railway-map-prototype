import L from "leaflet";

import SignalLayer from "../base/SignalLayer";

const layer = new SignalLayer({
    signalLayer: (latlngs, element) => {
        return L.polyline(latlngs, {color: 'transparent'});
    },
    tags: {
        "main": {
            tooltipText: ({element: signal}) => {
                let ref = signal.tags["ref"];
                let subsign = "";
                if (ref)
                    subsign = `<div class="subsign">${signal.tags["ref"]}</div>`
                return `<div class="sign"></div>${subsign}`;
            }
        },
        "combined": {
            tooltipText: ({element: signal}) => {
                let ref = signal.tags["ref"];
                let subsign = "";
                if (ref)
                    subsign = `<div class="subsign">${signal.tags["ref"]}</div>`
                return `<div class="sign"></div>${subsign}`;
            }
        },
        "distant": {
            tooltipText: ({element: signal}) => {
                let ref = signal.tags["ref"];
                let subsign = "";
                if (ref)
                    subsign = `<div class="subsign">${signal.tags["ref"]}</div>`
                return `<div class="sign"></div>${subsign}`;
            }
        }
    },
});

export default layer;