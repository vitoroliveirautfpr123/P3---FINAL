const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Veiculo = new Schema({
    nome:{
        type: String,
        required: true
    },
    marca:{
        type: String,
        required: true
    },
    data:{
        type: Date,
        default: Date.now() // por padrao a data será da hora do cadastro
    }
});

mongoose.model('veiculo',Veiculo);