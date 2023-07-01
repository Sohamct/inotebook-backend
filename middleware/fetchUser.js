const jwt = require('jsonwebtoken');
const JWT_SECRET = 'SohamIsagood$bOY';

const fetchUser = (req, resp, next) => {
    // get the user form the jwt and id to req object.
    const token = req.header('auth-token');
    if(!token){
        resp.status(401).send({error : "Please authenticate using a valid token"});
    }
    try{
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.user;
        next();
    }catch(error){
        resp.status(401).send({error : "Please authenticate using a valid token"});
    }
}

module.exports = fetchUser;