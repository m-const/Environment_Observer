module.exports = {
    ensureAuthenticated: function(req,res,next){
        /* if(req.isAuthenticated()){
            return next();
        } */
       // res.redirect(401,'./');
       console.log('[STUBBED] Authenticated')
       return next();
    }
}