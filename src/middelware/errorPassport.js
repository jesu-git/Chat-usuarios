import passport from "passport"




export const manejoError = (req,res,next)=>{
    passport.authenticate('JWT',{session:false},(error,user,info)=>{

        if(error || !user){
            return res.status(401).json("Token expirado")
        }
        next()
    })(req, res, next)
}