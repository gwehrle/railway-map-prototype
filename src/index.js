import "./base/deferAddLayer";
import 'leaflet-arrowheads';
import "leaflet.icon.glyph";
import "leaflet.markercluster";
import "leaflet-rotate";

import L from "leaflet";
import speed from "./speed/layer";
import speedValidation from "./speed/validation";
import interlocking from "./interlocking/layer";
import debug from "./debug/layer";
import milestones from "./milestones/layer";
import stops from "./stops/layer";
import vacancydetection from "./vacancy_detection/layer"

import { openstreetmap, openrailwaymap, openrailwaymap_signal, openrailwaymap_speed } from "./base/tilelayer";

const map = L.map('map', {
    center: [52.3, 10.5568],
    zoom: 13,
    layers: [openstreetmap, speed, stops, milestones],
    preferCanvas: true,
    rotate: true,
    rotateControl: {
        closeOnZeroBearing: false,
    },
    touchRotate: true,
    compassBearing: false,
});

L.control.scale().addTo(map);

L.control.layers(
    {
        "OpenStreetMap": openstreetmap,
        "OpenRailwayMap": openrailwaymap,
        "OpenRailwayMap – Speed": openrailwaymap_speed,
        "OpenRailwayMap – Signals": openrailwaymap_signal
    },
    {
        "Speed": speed,
        "Speed – Validation": speedValidation,
        "Signals": interlocking,
        "Milestones": milestones,
        "Vacancy detection": vacancydetection,
        // "Debug": debug
    }
).addTo(map);
