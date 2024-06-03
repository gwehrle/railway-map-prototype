import L from "leaflet";
import { getWaysWithNode } from '../base/utils';


const layer = new L.OverPassLayer({
    minZoom: 13,
    query: `
    (
        way["railway"="rail"]["service"!="yard"]["service"!="spur"]({{bbox}});
        node(w)["railway"="vacancy_detection"];
    );
    out geom;`,
    onSuccess(data) {
        for (const element of data.elements) {
            if (element.id in this._ids)
                continue;

            if (element.type !== "node")
                continue;

            const parentWays = getWaysWithNode(element, data.elements);

            const n1 = parentWays[0].geometry.at(0);
            const n2 = parentWays[0].geometry.at(-1);
            
            let ang = Math.round(angle(n1.lat, n1.lon, n2.lat, n2.lon));

            const popup = L.popup().setContent(this._getPoiPopupHTML(element.tags, element.id));
            const latlng = L.latLng(element.lat, element.lon);
            const myIcon = L.divIcon({
                className: `vacancy_detection`,
                iconSize: [30, 10],
                iconAnchor: [15, 5],
                html: `<div style="transform:rotate(${ang}deg);">=====</div>`,
            });
            const marker = L.marker(latlng, {icon: myIcon});
            marker.bindPopup(popup);
            this._markers.addLayer(marker);
        }
      }
});

function angle(cx, cy, ex, ey) {
    var dy = ey - cy;
    var dx = ex - cx;
    var theta = Math.atan2(dy, dx); // range (-PI, PI]
    theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
    //if (theta < 0) theta = 360 + theta; // range [0, 360)
    return theta;
}


export default layer;