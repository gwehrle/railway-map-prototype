import L from "leaflet";
import "leaflet.icon.glyph";
import { openJOSM } from "./utils";

export default class WarningMarker {
    private latlng;
    private node;
    private messages;
    private glyph_string;

    constructor (latlng, node: any) {
        this.latlng = latlng;
        this.node = node;
        this.glyph_string = "";
        this.messages = [];
    }

    addMessage (message: string, glyph: string = "⚠") {
        this.messages.push(message);
        this.glyph_string += glyph + " ";
    }

    get marker () {
        if (this.glyph_string == "")
            return null;
        
        const icon = L.icon.glyph({ prefix: '',  glyph: this.glyph_string });
        const marker = L.marker(this.latlng, { icon });

        if (this.messages.length > 0) {
            const popup = L.popup();


            const popupContent = document.createElement("div");
            const a = document.createElement("a");
            a.addEventListener("click", () => {
                openJOSM(marker._map.getBounds(), this.node.id);
            });
            a.href = "#";
            a.innerText = "Edit in JOSM";

            popupContent.append(a);            
    
            for (const message of this.messages) {
                const p = document.createElement("p");
                p.innerHTML = message;
                popupContent.append(p);
            }

            const table = document.createElement("table");
            table.innerHTML =
                            `<tr><th>Speed</th><td>${ this.node.tags["railway:signal:speed_limit:speed"] }</td></tr>
                            <tr><th>Position</th><td>${ this.node.tags["railway:signal:position"] }</td></tr>
                            <tr><th>Direction</th><td>${ this.node.tags["railway:signal:direction"] }</td></tr>`;

            popupContent.append(table);

            popup.setContent(popupContent);
            marker.bindPopup(popup);
        }

        return marker;
    }
}