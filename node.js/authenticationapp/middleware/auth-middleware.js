const jwt = require("jsonwebtoken");
const authmiddleware = (req, res, next) => {
    console.log('auth middle ware is on work ');
    const authheader = req.headers['authorization'];
    console.log(authheader);
    const token = authheader && authheader.split(" ")[1];// we split auth header with space and from first element 
    if (!token) {
        return res.status(404).json({
            success: false,
            message: "access denied no token provided"
        });
    };

    // we have to decode the token 
    try {
        const decodethetokeninfo = jwt.verify(token, "6879");// it will take token and the secret key as input 
        console.log(decodethetokeninfo);
        req.userInfo = decodethetokeninfo;
        next();
    }catch (error) {
        return res.status(500).json({
            success: false,
            message: "access denied no token provided "
        });
    };
};

module.exports = authmiddleware;