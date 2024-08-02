const mongoose = require('mongoose');

class Atrativo {
  constructor() {
    this.atrativoSchema = new mongoose.Schema({
      locationName: String,
      lat: Number,
      lng: Number,
      description: String,
      images: [String],
      type: String,
      visitationTips: String
    });

    this.model = mongoose.model('Atrativo', this.atrativoSchema);
  }
}

module.exports = new Atrativo();