module.exports = {
    eAdmin: function(req,res,next){
        if(req.isAuthenticated() && req.user.eAdmin == 'Admin'){ // se usuario esta autenticado e for admin
            return next();
        }
        req.flash('error_msg','Voce precisa ser Admin !');
        res.redirect('/');

    }
}