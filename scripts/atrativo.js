class Atrativo extends Local {
    constructor(locationName, lat, lng, description, images, type, visitationTips) {
        super(locationName, lat, lng, description, images)
        this.type = type
        this.visitationTips = visitationTips
    }
}
