module.exports = {
    ensureAuthenticated: function(req,res,next){
        /* if(req.isAuthenticated()){
            return next();
        } */
       // res.redirect(401,'./');
       console.log('[STUBBED] Authenticated')
       return next();
    },
    roleAuthorised: function(req,res,next){
       
       
       console.log('[STUBBED] roleAuthorised')
       return next();
    }
}