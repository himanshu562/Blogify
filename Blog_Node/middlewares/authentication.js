// it is used to show that person is logged in or not  and if not then show sigin and if logged in then show person name//

const {validateToken}=require("../services/authentication")
function checkForAuthenticationCookie(cookieName){
    return (req,res,next)=>{
        const tokenCookieValue=req.cookies[cookieName];
        if(!tokenCookieValue){
             return next();
        }
        try{
            const UserPayload=validateToken(tokenCookieValue);
            req.user=UserPayload;

        }
        catch(error){}
         return next();
    }
}
module.exports={
    checkForAuthenticationCookie,
};
