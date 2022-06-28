const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require('../models/usuario'); // peguei o model Usuario
const Usuario = mongoose.model('usuario'); // estou usando o model Usuario
const bcrypt  = require('bcryptjs'); // serve para aumentar a segurança da senha 
const passport = require('passport');


// Rota que manda para a pagina de cadastro de usuario
router.get('/registro',(req,res)=>{
    res.render('usuarios/registro');
});

//Rota que manda para a tela de login
router.get('/login',(req,res)=>{
    res.render('usuarios/login');
});

//Rota que faz o login
router.post('/login',(req,res,next)=>{
    passport.authenticate('local',{
        successRedirect: '/',
        failureRedirect: '/usuarios/login',
        failureFlash: true,
    })(req,res,next);
});

// Rota que cadastra usuario
router.post('/registro', (req,res)=>{
    var erros = [];

    // Validações 
    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: 'Nome inválido !'});
    }

    if(!req.body.email || typeof req.body.email == undefined || req.body.email == null){
        erros.push({texto: 'E-mail inválido !'});
    }

    if(!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null){
        erros.push({texto: 'Senha inválida !'});
    }

    if(req.body.senha.length < 4){
        erros.push({texto: 'Senha muito curta !'});
    }

    if(req.body.senha != req.body.senha2){
        erros.push({texto: 'As senhas são diferentes, tente novamente !'});
    }

    if(erros.length > 0){ // se deu algum erro de validação
        res.render('usuarios/registro',{erros: erros});
    }else{
        Usuario.findOne({email: req.body.email}).then((usuario)=>{ // pesquisando usuario por e-mail
            if(usuario){ // se existe usuario
                req.flash('error_msg','Já existe uma conta com este e-mail no sistema !');
                res.redirect('/usuarios/registro');
            }else{  // faz o cadastro
                const novoUsuario = new Usuario({
                    nome: req.body.nome,
                    email: req.body.email,
                    senha: req.body.senha,
                    eAdmin: req.body.eAdmin
                });

                bcrypt.genSalt(10,(erro,salt)=>{ // para tornar a senha mais segura
                    bcrypt.hash(novoUsuario.senha,salt,(erro, hash)=>{
                        if(erro){
                            req.flash('error_msg','Houve um erro durante o salvamento do usuário !');
                            res.redirect('/usuarios/registro');
                        }
                        novoUsuario.senha = hash; // estou encriptando a senha
                        novoUsuario.save().then(()=>{
                           req.flash('success_msg','Usuario cadastrado com sucesso !');
                           res.redirect('/usuarios/registro'); 
                        }).catch((err)=>{
                            req.flash('error_msg','Houve um erro ao cadastrar usuario !');
                            res.redirect('/usuarios/registro'); 
                        });
                    });
                });
            } 

        }).catch((err)=>{
            req.flash('error_msg','Houve um erro interno !');
        }); 
    }


});
module.exports = router;