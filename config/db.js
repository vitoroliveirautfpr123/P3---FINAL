if(process.env.NODE_ENV == "production"){ // se estiver no Heroku
    module.exports = {mongoURI: "mongodb+srv://root:<password>@cluster0.intls.mongodb.net/test"};

}else{
    module.exports = {mongoURI: "mongodb://localhost:27017/tesla"};
}