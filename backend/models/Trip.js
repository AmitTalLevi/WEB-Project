const mongoose = require('mongoose');
const { Schema } = mongoose;

const tripSchema = new Schema({
  uuid: { type: String, required: true },
  prompt: { type: String, required: true },
  response: { type: Array, required: true },
  generatedImage: { type: String, default: '' },
  country: { type: String, required: true } 
}, { timestamps: true });

tripSchema.methods.toString = function() {
  return `Trip [UUID: ${this.uuid}, Country: ${this.country}, Prompt: ${this.prompt}, Response: ${JSON.stringify(this.response, null, 2)}, Generated Image: ${this.generatedImage ? 'Yes' : 'No'}]`;
};

const Trip = mongoose.model('Trip', tripSchema);

module.exports = Trip;
