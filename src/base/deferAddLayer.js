import L from "leaflet";

export default L.FeatureGroup.include({
    _layers_to_draw: [],
    _layer_raf: undefined,
    addLayer(layer) {
		if (this.hasLayer(layer)) {
			return this;
		}

        

		layer.addEventParent(this);

        if (layer._popup)
            this._addLayerDeferred(layer);
        else
            L.LayerGroup.prototype.addLayer.call(this, layer);

		// @event layeradd: LayerEvent
		// Fired when a layer is added to this `FeatureGroup`
		return this.fire('layeradd', {layer});
	},
    _addLayerDeferred(layer) {
        this._layers_to_draw.push(layer);

        if (this._layer_raf)
            return;

        this._layer_raf = requestAnimationFrame(this._add_layer.bind(this))
    },
    _add_layer() {
        for (let i=0; i<=10 && this._layers_to_draw.length > 0; i++)
            L.LayerGroup.prototype.addLayer.call(this, this._layers_to_draw.pop());

        if (this._layers_to_draw.length > 0)
            requestAnimationFrame(this._add_layer.bind(this));
        else
            this._layer_raf = undefined;
    }
});