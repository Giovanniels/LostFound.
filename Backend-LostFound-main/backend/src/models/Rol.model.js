const mongoose = require("mongoose");


const rolSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
    },
});

const Rol = mongoose.model("Rol", rolSchema);

module.exports = Rol;
