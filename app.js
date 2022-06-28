// Carregando módulos
const express = require('express');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose'); // para usar o MongoDB
const app = express(); 
const path = require('path'); // serve para trabalhar com diretorios, manipular pastas
const admin = require('./routes/admin'); // para usar rotas
const usuarios = require('./routes/usuario'); 
const session = require('express-session');
const flash = require('connect-flash');



// Faz autenticação do usuario
const passport = require('passport');
require('./config/auth')(passport);



//Configurações
    //Sessão
    app.use(session({
        secret: "seguro", // preenchi com esse dado aleatório
        resave: true,
        saveUninitialized: true
    }));
    // Passport
    app.use(passport.initialize());
    app.use(passport.session());

    //Flash
    app.use(flash());
    //Middleware
    app.use((req,res,next)=>{
        res.locals.success_msg = req.flash("success_msg"); // serve para criar variaveis globais
        res.locals.error_msg = req.flash("error_msg"); // serve para criar variaveis globais
        res.locals.error = req.flash("error");
        res.locals.user = req.user || null; // armazena os dados do usuario autenticado
        next(); // Manda continuar para outras requisições, se não ele para aqui e não sai
    });


    //Body Parser
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());
    //Handlebars
    // Para usar handlebars como Template Engine
    app.engine('handlebars', handlebars.engine({defaultLayout: 'main'}));// main é o template padrão da aplicação
    app.set('view engine','handlebars');
    // Mongoose
    mongoose.connect("mongodb://localhost:27017/tesla").then(()=>{
        console.log("Banco conectado com sucesso!!!");
    }).catch((err)=>{
        console.log("Houve um erro ao se conectar ao banco:" +err);
    });
    // Public
    app.use(express.static('public')); // a pasta que guarda todos os arquivos estaticos é a public

    // Rota Principal
      app.get('/',function(req,res){ // usando função de callback
        res.sendFile(__dirname + '/index.html');
    });

    // Chamando rotas

    app.use('/admin',admin); // /admin é o prefixo das rotas que estão no admin.js (grupo de rotas)
    // se eu criar rotas aqui elas nao tem prefixo
    app.use('/usuarios',usuarios);

//Outros
const PORT = 8081; // minha porta escolhida
app.listen(PORT,()=>{
    console.log('Servidor rodando !');
});