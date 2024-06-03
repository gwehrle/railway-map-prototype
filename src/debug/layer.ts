import L from "leaflet";

const layer = new L.OverPassLayer({
    minZoom: 13,
    query: `
    (
        way["railway"="rail"]["service"!="yard"]["service"!="spur"]({{bbox}});
        node(w)["railway"="signal"];
    );
    out geom;`,
    onSuccess(data) {
        for (const element of data.elements) {
            if (element.id in this._ids)
                continue;

            if (element.type !== "node")
                continue;

            const railway_signal_ignore = [
                "position",
                "direction",
                "main",
                "combined",
                "speed", "speed_distant",
                
                "crossing_info",
                "fouling_point",
                "whistle",
                "crossing", "crossing_distant",
                "shunting",
                "station_distant", // Vorwarnung zur Station
                "stop",
                "route", // Richtungsanzeiger
                "traversable", // Mastschilder; Was passiert bei Ausfall
                "minor",
                "distant",
                "switch",
                "electricity",
                "brake_test",
                "form",
                "wrong_road",
                "snowplow",
                "milestone",
            ];

            const general_ignore = [
                "description", "name", "caption", "inscription",
                "start_date", "end_date", "construction_date",
                "source", "squirrel", "source:squirrel",

                "barrier",
                "foot",
                "bicycle",
                
                "fixme", "note",

                "ref",
                "operator",
                "railway:switch_ref",
                "railway:position:exact",
                "railway:position",
                "railway:signal:height",
            ];

            const tags = element.tags;

            delete tags["railway"];

            for (const [tag_name, tag] of Object.entries(tags)) {
                if (general_ignore.includes(tag_name)) {
                    delete tags[tag_name];
                    continue;
                }

                for (const start of railway_signal_ignore) {
                    if (tag_name.startsWith("railway:signal:" + start)) {
                        delete tags[tag_name];
                        break;
                    }
                }    
            }      

            const latlon = L.latLng(element.lat, element.lon);
            const marker = L.circle(latlon, {
                radius: 120,
                fillColor: "red",
                fillOpacity: 0.3,
                color: "lime"
            });
            if (Object.keys(tags).length > 0) {
                const popup = L.popup().setContent(this._getPoiPopupHTML(tags, element.id));
                marker.bindPopup(popup);
                this._markers.addLayer(marker);
            }
        }
      }
});


export default layer;