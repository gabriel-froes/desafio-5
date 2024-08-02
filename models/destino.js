const mongoose = require('mongoose');
const Atrativo = require('./atrativo');

class Destino {
  constructor() {
    this.destinoSchema = new mongoose.Schema({
      locationName: String,
      lat: Number,
      lng: Number,
      description: String,
      images: [String],
      attractions: [Atrativo.atrativoSchema]
    });

    this.model = mongoose.model('Destino', this.destinoSchema);
  }
}

module.exports = new Destino();
