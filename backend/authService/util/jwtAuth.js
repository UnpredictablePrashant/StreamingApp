const jwt = require('jsonwebtoken');

let jwtTokenGenerator = (userEmail) => {
    const token = jwt.sign({
        username: userEmail,
      }, process.env.JWT_SECRET);
    console.log('jwttoken util: ',token)
    return token
}

let jwtTokenVerify = (token) => {
    let verify = jwt.verify(token, process.env.JWT_SECRET)
    console.log('Verify util: ',verify)
    return verify
}

module.exports = {jwtTokenGenerator, jwtTokenVerify}