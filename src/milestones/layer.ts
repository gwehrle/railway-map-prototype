import L from "leaflet";

const layer = new L.OverPassLayer({
    minZoom: 13,
    query: `
    (
        way["railway"="rail"]["service"!="yard"]["service"!="spur"]({{bbox}});
        node(around: 100)["railway"="milestone"];
    );
    out geom;`,
    onSuccess(data) {
        for (const element of data.elements) {
            if (element.id in this._ids)
                continue;

            if (element.type !== "node")
                continue;

            const latlng = L.latLng(element.lat, element.lon);
            const myIcon = L.divIcon({
                className: `milestone`,
                iconSize: [30, 10],
                iconAnchor: [15, 5],
                html: element.tags["railway:position"],
            });
            const marker = L.marker(latlng, {icon: myIcon});
            this._markers.addLayer(marker);
        }
      }
});


export default layer;