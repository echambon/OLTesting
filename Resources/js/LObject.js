const LDataTypes = {
    GPX: 0,
    KML: 1,
    KMZ: 2,
    LEONAR: 3
}

class LObject {
    constructor(name, data, layer) {
        this.name = name;
        this.type = LDataTypes.LEONAR;
        this.data = data;
        this.layer = layer; // VectorLayer
    }
}
