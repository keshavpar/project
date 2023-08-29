const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {

    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'Cognizant');
    req.userData = { userId: decodedToken.userId };
    req.user={user: decodedToken.user}
    next();
  } catch (error) {
    res.status(401).json({ error: 'Authentication failed' });
  }
};