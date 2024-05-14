const mongoose = require("mongoose");
const natural = require('natural');

const TipoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    unique: true // Asegura que no haya tipos duplicados
  },
});

TipoSchema.pre('save', async function(next) {
  const tipo = this;

  // Obtener todos los tipos existentes
  const tiposExistentes = await mongoose.model('Tipo').find();

  // Calcular la similitud entre el nuevo tipo y los existentes
  const nuevoNombre = tipo.nombre.toLowerCase();
  const tokenizer = new natural.WordTokenizer();
  const similitudes = tiposExistentes.map(tipoExistente => {
    const nombreExistente = tipoExistente.nombre.toLowerCase();
    const tokensNuevo = tokenizer.tokenize(nuevoNombre);
    const tokensExistente = tokenizer.tokenize(nombreExistente);
    return natural.JaroWinklerDistance(tokensNuevo.join(' '), tokensExistente.join(' '));
  });

  // Rechazar la creación si la similitud supera el umbral
  const umbral = 0.8; // Umbral mínimo de similitud
  if (Math.max(...similitudes) > umbral) {
    throw new Error('El nuevo tipo es demasiado similar a uno existente.');
  }

  next();
});

const Tipo = mongoose.model("Tipo", TipoSchema);

module.exports = Tipo;
