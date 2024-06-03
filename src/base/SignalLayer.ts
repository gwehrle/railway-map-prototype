import L from 'leaflet';
import "leaflet-overpass-layer/dist/OverPassLayer.bundle";
import { getWaysWithNode, openJOSM } from './utils';

// @ts-ignore
const signalLayer = L.OverPassLayer.extend({
    options: {
        signalLayer: (latlngs, element) => {return null},
        tags: {},
        minZoom: 13,
        onSuccess(data) {
            for (const element of data.elements) {
                if (element.id in this._ids) {
                    continue;
                }
    
                if (element.type == "way") {
                    // Transform element geometry to latlan array
                    const latlngs = element.geometry.map(point => [point.lat, point.lon]);
                    
                    // Draw ways / rails
                    const wayLayer = this.options.signalLayer(latlngs, element);
                    if (wayLayer)
                        this._markers.addLayer(wayLayer);
                    continue;
                }

                const props = new Properties(element);
    
                for (let [tagName, properties] of Object.entries(this.options.tags)) {
                    if (!("railway:signal:" + tagName in element.tags))
                        continue;

                    props.setTagNameAndProperties(tagName, properties);

                    const latlng = L.latLng(element.lat, element.lon);

                    // Create default marker
                    const position = element.tags["railway:signal:position"];
                    const direction = ["left", "right"].includes(position) ? position : "top";
                    const func = element.tags["railway:signal:" + tagName + ":function"] ? element.tags["railway:signal:" + tagName + ":function"] : "";
                    const popup = L.popup().setContent(this._getPoiPopupHTML(element.tags, element.id));
                    const parentWays = getWaysWithNode(element, data.elements);


                    const tooltipText = props.get("tooltipText", null);
                    if (tooltipText == null)
                        continue;

                    const n1 = parentWays[0].geometry.at(0);
                    const n2 = parentWays[0].geometry.at(-1);
                    
                    let ang = Math.round(angle(n1.lat, n1.lon, n2.lat, n2.lon));

                    if (element.tags["railway:signal:direction"] == "backward")
                        ang += 180;

                    const iconSize = [25, 35];
                    const additionalClasses = props.get("class_names", "");

                    const myIcon = L.divIcon({
                        className: `signal ${tagName} ${direction} ${func} ${additionalClasses}`,
                        iconSize: iconSize,
                        iconAnchor: [0, iconSize[1]],
                        html: `
                            <div class="signal_wrapper" style="transform:rotate(${ang}deg) translateX(50%);">
                                ${tooltipText}
                            </div>
                        `,
                    });
                    
                    const marker = L.marker(latlng, {icon: myIcon, rotation: 0, rotateWithView: true});
                    marker.bindPopup(popup);
                    this._markers.addLayer(marker);
                }
            }
        },
    },
    initialize(options) {
        // Build query from Tags
        const tagQuery = Object.keys(options.tags).map((tag) => `node["railway:signal:${tag}"](w.rail);`).join("");
        options.query = `
            way["railway"="rail"]["service"!="yard"]["service"!="spur"]({{bbox}}) -> .rail;
            (
                .rail;
                ${tagQuery}
            );
            out geom;`;

        // Init parent class
        L.OverPassLayer.prototype.initialize.call(this, options);
    },
    _getPoiPopupHTML(tags, id) {
        let row;
        const link = document.createElement('a');
        const table = document.createElement('table');
        const div = document.createElement('div');

        const a = document.createElement("a");
        link.addEventListener("click", () => {
            openJOSM(this._map.getBounds(), id);
        });
        link.href = "#";
        link.innerText = "Edit in JOSM";
        
        for (const key in tags) {
          row = table.insertRow(0);
          row.insertCell(0).appendChild(document.createTextNode(key));
          row.insertCell(1).appendChild(document.createTextNode(tags[key]));
        }
    
        div.appendChild(link);
        div.appendChild(table);
    
        return div;
      },
});

class Properties {
    element: any;
    tagName: string;
    properties: {};

    constructor(element) {
        this.element = element;
    }

    setTagNameAndProperties(tagName: string, properties: {}) {
        this.tagName = tagName;
        this.properties = properties;
    }

    get(name: string, fallback: any) {
        const prop = this.properties[name];
        if (prop == undefined)
            return fallback;
    
        if (typeof prop == "function") {
            return prop({element: this.element, tagName: this.tagName});
        }
    
        return prop;
    }
}

function angle(cx, cy, ex, ey) {
    var dy = ey - cy;
    var dx = ex - cx;
    var theta = Math.atan2(dy, dx); // range (-PI, PI]
    theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
    //if (theta < 0) theta = 360 + theta; // range [0, 360)
    return theta;
}

export default signalLayer;