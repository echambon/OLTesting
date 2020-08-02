class LObject {
    constructor(name, active, layer) {
        this.name = name; // Stockable in VectorLayer?
        this.active = active; // Stockable in VectorLayer?
        this.longitude = []; // Stockable in VectorLayer?
        this.latitude = []; // Stockable in VectorLayer?
        this.speed = []; // Stockable in VectorLayer?
        this.layer = layer; // VectorLayer
    }
}
