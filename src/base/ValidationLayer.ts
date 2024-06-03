import L from 'leaflet';

import WarningMarker from "./WarningMarker";
import { getWaysWithNode } from "./utils";

// @ts-ignore
export default L.OverPassLayer.extend({
    options: {
        tags: {},
        minZoom: 13,
        onSuccess(data) {
            for (const element of data.elements) {
                if (element.id in this._ids) {
                    continue;
                }

                if (element.type == "way") {
                    continue;
                }

                const latlng = L.latLng(element.lat, element.lon);

                // Apply Validation rules
                const validation = new WarningMarker(latlng, element);
                const parentWays = getWaysWithNode(element, data.elements);

                for (let [tagName, properties] of Object.entries(this.options.tags)) {
                    if (!("railway:signal:" + tagName in element.tags))
                        continue;

                    for (const rule of properties.rules) {
                        if (rule.valid(element, parentWays) == false)
                            validation.addMessage(rule.errorMessage, rule.glyph);
                    }
                    if (validation.marker != null)
                        this._markers.addLayer(validation.marker);
                }
            }
        }
    },
    initialize(options) {
        // Build query from Tags
        const tagQuery = Object.keys(options.tags).map((tag) => `node(w)["railway:signal:${tag}"];`).join("");
        options.query = `
            (
                way["railway"="rail"]["service"!="yard"]["service"!="spur"]({{bbox}});
                ${tagQuery}
            );
            out geom;`;

        // Init parent class
        L.OverPassLayer.prototype.initialize.call(this, options);
    },
});