class Destino extends Local {
    constructor(locationName, lat, lng, description, images, attractions) {
        super(locationName, lat, lng, description, images)
        this.attractions = attractions
    }
}
