if(process.env.NODE_ENV == "production"){ // se estiver no Heroku
    module.exports = {mongoURI: "mongodb+srv://root:kivkat92@cluster1.intls.mongodb.net/?retryWrites=true&w=majority"};

}else{
    module.exports = {mongoURI: "mongodb://localhost:27017/tesla"};
}

