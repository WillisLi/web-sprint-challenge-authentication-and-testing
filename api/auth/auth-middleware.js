const Users = require('./users-model');

const checkUsernameExists = (req, res, next) => {
    const { username } = req.body;
    Users.getBy({ username })
      .then(exists => {
        if (!exists.length) {
          res.status(401).json({message: "invalid credentials"})
        } else {
          req.user = exists[0]
          next();
        }
      })
      .catch(next);
}

const checkUsernameFree = (req, res, next) => {
    const { username } = req.body;
    Users.getBy({ username })
        .then(exists => {
            if (exists.length) {
                res.status(422).json({message: "username taken"})
            } else {
                next();
            }
        })
        .catch(next);
}

const noMissingCredentials = (req, res, next) => {
    const { username, password } = req.body;
    if (!username || !password) {
        res.status(422).json({message: "username and password required"})
    } else {
        next()
    }
}

module.exports = {
    checkUsernameExists,
    checkUsernameFree,
    noMissingCredentials,
  }