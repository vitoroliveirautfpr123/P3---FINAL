const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Postagem = new Schema({
    anoFabricacao:{
        type: String,
        required: true
    },
    cor:{
        type: String,
        required: true
    },
    preco:{
        type: String,
        required: true
    },
    descricao:{
        type: String,
        required: true
    },
    veiculo:{        // estou relacionando com o model Veiculo
        type: Schema.Types.ObjectId,        // armazena um id de um veiculo
        ref: "veiculo",
        required: true
    },
    data:{
        type: Date,
        default: Date.now()
    }

});

mongoose.model('postagem',Postagem);