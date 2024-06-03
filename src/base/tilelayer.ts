import L from "leaflet";

const attribution = {
	orm: '<a href="https://www.openstreetmap.org/copyright">© OpenStreetMap contributors</a>, Style: <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA 2.0</a> <a href="http://www.openrailwaymap.org/">OpenRailwayMap</a> and OpenStreetMap',
	osm: '<a href="https://www.openstreetmap.org/copyright">© OpenStreetMap contributors</a>, Style: <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA 2.0</a> <a href="http://www.openrailwaymap.org/">OpenRailwayMap</a>',
} 

const openrailwaymap = new L.TileLayer(
	'https://{s}.tiles.openrailwaymap.org/standard/{z}/{x}/{y}.png',
	{
		attribution: attribution.orm,
		minZoom: 2,
		maxZoom: 19,
	}
);

const openrailwaymap_speed = new L.TileLayer(
	'https://{s}.tiles.openrailwaymap.org/maxspeed/{z}/{x}/{y}.png',
	{
		attribution: attribution.orm,
		minZoom: 2,
		maxZoom: 19,
	}
);


const openrailwaymap_signal = new L.TileLayer(
	'https://{s}.tiles.openrailwaymap.org/signals/{z}/{x}/{y}.png',
	{
		attribution: attribution.orm,
		minZoom: 2,
		maxZoom: 19,
	}
);

const openstreetmap = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: attribution.osm,
    maxZoom: 19,
});

export {
	openrailwaymap,
	openrailwaymap_speed,
	openrailwaymap_signal,
	openstreetmap
}