const jwt = require("jsonwebtoken");

const verifytoken = (req, res, next) => {

    const bearerHeader = req.headers["authorization"];

    if (!bearerHeader) {
        return res.status(403).send({
            message: "Token required"
        });
    }

    const token = bearerHeader.split(" ")[1];

    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {

        if (err) {
            return res.status(401).send({
                success: false,
                message: "Invalid token"
            });
        }

        req.user = decoded;

        next();
    });
};

module.exports = verifytoken;