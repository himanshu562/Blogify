const JWT= require("jsonwebtoken");

const secret="$uperMan@123"    //  kept token as a secret//

function createTokenForUser(user){
    const payload={
        _id: user._id,
        email:user.email,
        ProfileImageUrl: user.ProfileImageUrl,
        role:user.role,

    };
    const token= JWT.sign(payload,secret);
    return token;
}

function validateToken(token){
    const payload=JWT.verify(token,secret);
    return payload;
}

module.exports={
    createTokenForUser,
    validateToken,
}