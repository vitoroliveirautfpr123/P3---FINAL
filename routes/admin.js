    const express = require('express');
    const router = express.Router();
    const mongoose = require('mongoose');
    require('../models/veiculo'); // peguei o model Veiculo
    const Veiculo = mongoose.model('veiculo'); // estou usando o model Veiculo
    require('../models/postagem'); // peguei o model Veiculo
    const Postagem = mongoose.model('postagem'); // estou usando o model Veiculo
    const {eAdmin} = require('../helpers/eAdmin');



    // Rota que lista cadastro de veiculos e manda para o formulario de cadastro de veiculo
    router.get('/cad',(req,res)=>{
            Veiculo.find().sort({data: 'desc'}).lean().then((veiculo) =>{ // estou listando os veiculos ja cadastrados por ordem decrescente
            res.render('admin/veiculo',{veiculo: veiculo});   
        });
    
    });


    // Rota que leva para o formulario de cadastro de veiculo
    router.get('/cad/add',eAdmin,(req,res)=>{
        res.render('admin/cadVeiculo');
    });

    // Rota que leva para o formulario de consulta de veiculo
    router.get('/cons',(req,res)=>{
         res.render('admin/consVeiculo');
    });

    // Rota que faz a consulta por marca
    router.post('/cons',(req,res)=>{
        Veiculo.find({marca: ''+req.body.marca+''}).sort({data: 'desc'}).lean().then((veiculo) =>{ // estou listando os veiculos pela marca, tem que usar aspas antes e depois pq é a marca passada é string 
            res.render('admin/mostraVeiculo',{veiculo: veiculo});    
        });
    });

    // Rota que faz o cadastro de veiculo
    router.post('/cad/add',eAdmin, (req,res)=>{
        var erros = []; // declarei um array vazio

        // Validações do formulario
        if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null ){ // se nao foi passado um nome, se o tipo do campo for undefined ou o campo for nulo 
            erros.push({texto: 'Nome inválido'}); // serve para colocar um novo dado dentro do array
        }
        if(!req.body.marca || typeof req.body.marca == undefined || req.body.marca == null ){ // se nao foi passado um nome, se o tipo do campo for undefined ou o campo for nulo 
            erros.push({texto: 'Marca inválida'}); // serve para colocar um novo dado dentro do array
        }
        if(req.body.nome.length <3){
            erros.push({texto: 'Nome do veículo muito pequeno !'});
        }
        if(req.body.marca.length <3){
            erros.push({texto: 'Nome da marca muito pequeno !'});
        }

        if(erros.length >0){ // teve algum erro
            res.render('admin/cadVeiculo',{erros: erros});
        }else{ // cadastra no banco
            const novoVeiculo = {
                // os campos nome e marca fazem referencia ao 'name' das tags input do cadastro.handlebars
                nome: req.body.nome,
                marca: req.body.marca
            }
            new Veiculo (novoVeiculo).save().then(()=>{
                req.flash('success_msg','Veiculo cadastrado com sucesso !');
                res.redirect('/admin/cad');
            }).catch((err)=>{
                req.flash('error_msg','Houve um erro ao cadastrar o veículo !');
                res.redirect('/admin/cad');
            });
        }
       
    });

    // Rota que seta para os campos nos formularios para editar os dados do veiculo
    router.get('/cad/edit/:id',eAdmin,(req,res)=>{
        Veiculo.findOne({_id:req.params.id}).lean().then((veiculo)=>{// pesquisa o registro de veiculo onde o id é o que foi passado
            res.render('admin/editVeiculo',{veiculo:veiculo});
        }).catch((err)=>{
            req.flash('error_msg','Veículo não existe !');
        }); 

    });

    // Rota que edita veiculo
    router.post('/cad/edit',eAdmin, (req,res)=>{
        Veiculo.findOne({_id: req.body.id}).then((veiculo)=>{  // pesquisa um veiculo pelo id
            veiculo.nome = req.body.nome; // o campo nome recebe o valor que eu digitar no input
            veiculo.marca = req.body.marca;

            veiculo.save().then(()=>{
                req.flash('success_msg','Veiculo editado com sucesso !');
                res.redirect('/admin/cad');
            }).catch((err)=>{
                req.flash('error_msg','Houve um erro interno ao salvar a edição do veículo !');
                res.redirect('/admin/cad');
            });
        }).catch((err) =>{
            req.flash('error_msg','Houve um erro ao editar o veículo !');
            res.redirect('/admin/cad');
        });
    });
    
    // Rota que deleta veiculo

    router.post('/cad/del',eAdmin,(req,res)=>{
        Veiculo.deleteOne({_id: req.body.id}).then(()=>{ // remove o veiculo pelo id
            req.flash('success_msg','Veiculo deletado com sucesso !');
            res.redirect('/admin/cad');
        }).catch((err)=>{
            req.flash('error_msg','Houve um erro ao deletar o veiculo !');
        }); 
    });

    
    //Rota de listagem de postagens
    router.get('/postagem',(req,res)=>{
        Postagem.find().lean().populate('veiculo').sort({data: "desc"}).then((postagem)=>{
            res.render('admin/postagem', {postagem: postagem});
        }).catch((err)=>{
            req.flash('error_msg','Houve um erro ao listar os veículos !');
            res.redirect('/admin/postagem');
        });
        
    });

    // Rota que manda para a pagina de cadastro de postagens
    router.get('/postagem/add',eAdmin,(req,res)=>{
        Veiculo.find().lean().then((veiculo)=>{
            res.render('admin/cadPostagem', {veiculo: veiculo});
        }).catch((err)=>{
            req.flash('error_msg','Houve um erro ao carregar o formulário !');
            res.redirect('/admin/postagem');
        });
        
    });
    
    // Rota que cadastra postagem de veiculo
    router.post('/postagem/nova',eAdmin, (req,res)=>{
        var erros = [];

         // Validações do formulario
         if(!req.body.anoFabricacao || typeof req.body.anoFabricacao == undefined || req.body.anoFabricacao == null ){ 
            erros.push({texto: 'Ano de fabricação inválido'}); // serve para colocar um novo dado dentro do array
        }
        if(!req.body.cor || typeof req.body.cor == undefined || req.body.cor == null ){  
            erros.push({texto: 'Cor inválida'}); // serve para colocar um novo dado dentro do array
        }
        if(!req.body.preco || typeof req.body.preco== undefined || req.body.preco == null ){  
            erros.push({texto: 'Preço inválido'}); // serve para colocar um novo dado dentro do array
        }
        if(!req.body.descricao || typeof req.body.descricao == undefined || req.body.descricao == null ){  
            erros.push({texto: 'Descrição inválida'}); // serve para colocar um novo dado dentro do array
        }
        
        if(req.body.veiculo == "0"){
            erros.push({texto: "Veiculo inválido, cadastre um veiculo !"});
        }
        if(erros.length >0){ // teve algum erro
            res.render('admin/cadPostagem',{erros: erros});
        }else{ // se não deu nenhum erro
            const novaPostagem = {
                anoFabricacao: req.body.anoFabricacao,
                cor: req.body.cor,
                preco: req.body.preco,
                descricao: req.body.descricao,
                veiculo: req.body.veiculo
            };
            
            new Postagem (novaPostagem).save().then(()=>{
                req.flash('success_msg','Postagem cadastrada com sucesso !');
                res.redirect('/admin/postagem');
            }).catch((err)=>{
                req.flash('error_msg','Houve um erro ao cadastrar a postagem !');
                res.redirect('/admin/postagem');
            });
        }    
    });

    // Rota que seta para os campos nos formularios para editar os dados da postagem
    router.get('/postagem/edit/:id',eAdmin,(req,res)=>{
        Postagem.findOne({_id:req.params.id}).lean().then((postagem)=>{
            Veiculo.find().lean().then((veiculo)=>{
                res.render('admin/editPostagem',{veiculo: veiculo, postagem: postagem});
            }).catch((err)=>{
                req.flash('error_msg','Houve um erro ao listar os veiculos !');
                res.redirect('/admin/postagem');
            });
        }).catch((err)=>{
            req.flash('error_msg','Houve um erro ao carregar o formulário de edição !');
            res.redirect('/admin/postagem');
        }); 
        
    });

    // Rota que edita postagem
    router.post('/postagem/edit',eAdmin, (req,res)=>{
        Postagem.findOne({_id: req.body.id}).then((postagem)=>{  // pesquisa uma postagem pelo id
            postagem.anoFabricacao = req.body.anoFabricacao; // o campo recebe o valor que eu digitar no input
            postagem.cor = req.body.cor; 
            postagem.preco = req.body.preco; 
            postagem.descricao = req.body.descricao; 
            postagem.veiculo = req.body.veiculo; 

            postagem.save().then(()=>{
                req.flash('success_msg','Postagem editada com sucesso !');
                res.redirect('/admin/postagem');
            }).catch((err)=>{
                req.flash('error_msg','Houve um erro interno ao salvar a edição da postagem !');
                res.redirect('/admin/postagem');
            });
        }).catch((err) =>{
            req.flash('error_msg','Houve um erro ao editar a postagem !');
            res.redirect('/admin/postagem');
        });
    });

    //Rota que deleta postagem
    router.post('/postagem/del',eAdmin,(req,res)=>{
        Postagem.deleteOne({_id: req.body.id}).then(()=>{ // remove o veiculo pelo id
            req.flash('success_msg','Postagem deletada com sucesso !');
            res.redirect('/admin/postagem');
        }).catch((err)=>{
            req.flash('error_msg','Houve um erro ao deletar a postagem !');
            res.redirect('/admin/postagem');
        }); 
    });

    module.exports = router;
