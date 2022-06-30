if(process.env.NODE_ENV == "production"){ // se estiver no Heroku
    module.exports = {mongoURI: "mongodb+srv://vitor:vitor@cluster0.vmyok.mongodb.net/?retryWrites=true&w=majority"};

}else{
    module.exports = {mongoURI: "mongodb://localhost:27017/tesla"};
}

