const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 10, // limit each IP to 10 requests per windowMs
});

//  apply to all requests
module.exports = limiter;