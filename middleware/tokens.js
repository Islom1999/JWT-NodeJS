
const jwt = require("jsonwebtoken");

const protected = async( req, res, next ) => {
    try {
        const token = req.headers["authorization"];

        if (!token) {
            return res.status(401).json({
            message: "Unauthorized",
            });
        }
        const verify = jwt.verify(token, process.env.SECRET_KEY);

        req.jwt = verify;
        next();

    } catch (error) {
        return res.status(401).json({
            message: "Unauthorized",
        });
    }
}


module.exports = { protected };
