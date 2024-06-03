import L from "leaflet";

import SignalLayer from "../base/SignalLayer";
import "leaflet-polylineoffset";

const _getColor = (speed: number) => {
    // Colors from openrailwaymap
    // https://github.com/OpenRailwayMap/OpenRailwayMap/blob/970bf7e883da00fc5c65d640864fc22b6fe376b1/styles/maxspeed.mapcss#L125-L159 
    const thresholdColors = {
        10: "#0100CB",
        20: "#001ECB",
        30: "#003DCB",
        40: "#005BCB",
        50: "#007ACB",
        60: "#0098CB",
        70: "#00B7CB",
        80: "#00CBC1",
        90: "#00CBA2",
        100: "#00CB84",
        110: "#00CB66",
        120: "#00CB47",
        130: "#00CB29",
        140: "#00CB0A",
        150: "#14CB00",
        160: "#33CB00",
        170: "#51CB00",
        180: "#70CB00",
        190: "#8ECB00",
        200: "#ADCB00",
        210: "#CBCB00",
        220: "#CBAD00",
        230: "#CB8E00",
        240: "#CB7000",
        250: "#CB5100",
        260: "#CB3300",
        270: "#CB1400",
        280: "#CB0007",
        290: "#CB0025",
        300: "#CB0044",
        320: "#CB0062",
        340: "#CB0081",
        360: "#CB009F",
        380: "#CB00BD",
        400: "#BA00CB"
    };

    let color =  "gray";
    for (const threshold in thresholdColors) {
        if (speed <= parseInt(threshold)) {
            color = thresholdColors[threshold];
            break;
        }
    }

    return color;
} 

const layer = new SignalLayer({
    signalLayer: (latlngs, rail) => {
        const maxspeed = rail.tags.maxspeed;
        const maxspeed_fw = rail.tags["maxspeed:forward"];
        const maxspeed_bw = rail.tags["maxspeed:backward"];
        

        const layer = L.layerGroup();

        let main_line;
        if (maxspeed_fw != undefined) {
            const backward_line = new L.Polyline(latlngs, {color: _getColor(maxspeed_bw), weight: 5, });
            layer.addLayer(backward_line);

            main_line = new L.Polyline(latlngs, {color: _getColor(maxspeed_fw), weight: 5, dashArray: [10, 20]});
            layer.addLayer(main_line);
        } else {
            main_line = new L.Polyline(latlngs, {color: _getColor(maxspeed), weight: 5});
            layer.addLayer(main_line);
        }

        const main_color = maxspeed != undefined ? _getColor(maxspeed) : _getColor(maxspeed_fw);
        const arrwowheads = main_line.arrowheads({ color: 'transparent' });
        
        main_line.bindTooltip(`
            <table>
                <tr>
                    <th>maxspeed</th><td>${maxspeed}</td>
                </tr>
                <tr>
                    <th>maxspeed forward</th><td>${maxspeed_fw}</td>
                </tr>
                <tr>
                    <th>maxspeed backward</th><td>${maxspeed_bw}</td>
                </tr>
            </table>
        `);
        main_line.on("tooltipopen", () => {
            main_line.setStyle({ color: "orange" });
            arrwowheads.arrowheads({fill: true, size:"5px", frequency: "20px", color: 'black' });
            arrwowheads._update();
        });
        main_line.on("tooltipclose", () => {
            main_line.setStyle({ color: main_color });
            arrwowheads.arrowheads({ color: 'transparent' });
            arrwowheads._update();
        });

        return layer;
    },
    tags: {
        "speed_limit": {
            class_names: ({element: signal}) => {
                if (signal.tags["railway:signal:speed_limit"].toLowerCase() == "de-eso:zs3")
                    return "zs3";

                if (signal.tags["railway:signal:speed_limit"].toLowerCase() == "de-eso:lf7")
                    return "lf7";

                return "";
            },
            tooltipText: ({element: signal, tagName}) => {
                const ref = signal.tags["ref"];
                let speed_str = signal.tags["railway:signal:" + tagName + ":speed"];
                
                if (!speed_str)
                    speed_str = "";

                let max_speed = "-1";
                for (const speed of speed_str.split(";")) {
                    if (parseInt(speed).toString() == speed && parseInt(speed) / 10 > parseInt(max_speed)) {
                        max_speed = (speed / 10).toString();
                    }
                }

                if (max_speed == "-1")
                    max_speed = "?";

                let tooltip = `<div class="sign">${max_speed}</div>`;
                tooltip += ref ? `<div class="subsign">${ref}</div>` : "";

                return tooltip;
            }
        },
    },
});

export default layer;