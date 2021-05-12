const models = require('../models');

const { Account } = models;

const loginPage = (req, res) => {
  res.render('login', { csrfToken: req.csrfToken() });
};


const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

const login = (request, response) => {
  const req = request;
  const res = response;

  // force cast to strings to cover some security flaws
  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;

  if (!username || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  return Account.AccountModel.authenticate(username, password, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password' });
    }

    req.session.account = Account.AccountModel.toAPI(account);

    return res.json({ redirect: '/voter' });
  });
};

const signup = (request, response) => {
  const req = request;
  const res = response;

  // cast to strings to cover up some security flaws
  req.body.username = `${req.body.username}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  if (!req.body.username || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
    const accountData = {
      username: req.body.username,
      salt,
      password: hash,
    };

    const newAccount = new Account.AccountModel(accountData);

    const savePromise = newAccount.save();

    savePromise.then(() => {
      req.session.account = Account.AccountModel.toAPI(newAccount);
      res.json({ redirect: '/voter' });
    });

    savePromise.catch((err) => {
      console.log(err);

      if (err.code === 11000) {
        return res.status(400).json({ error: 'Username already in use.' });
      }

      return res.status(400).json({ error: 'An error occurred. Code: 11' });
    });
  });
};

/*
/ ADDED - changePassword
/ based on Pran R.V.'s answer at https://stackoverflow.com/questions/17828663/passport-local-mongoose-change-password
/ changes a user's password if they have entered their current username and password
*/
const changePassword = (request, response) => {
  const req = request;
  const res = response;

  console.log("req.body: ");
  console.log(req.body);

  Account.AccountModel.findByUsername(req.body.username, (err, user) => {
    if (err) {
      console.log(err)
    } else {
      if (!user) {
        res.json({success: false, message: 'User not found' });
      } else {
        console.log("password change attempted");
        user.changePassword(req.body.oldPass, req.body.newPass, function(err) {
          if(err) {
                   if(err.name === 'IncorrectPasswordError'){
                        res.json({ success: false, message: 'Incorrect password' }); // Return error
                   }else {
                       res.json({ success: false, message: 'Something went wrong!! Please try again after sometimes.' });
                   }
         } else {
           res.json({ success: true, message: 'Your password has been changed successfully' });
          }
        })
      }
    }
  });
};

const getToken = (request, response) => {
  const req = request;
  const res = response;

  const csrfJSON = {
    csrfToken: req.csrfToken(),
  };

  res.json(csrfJSON);
};

module.exports.loginPage = loginPage;
module.exports.login = login;
module.exports.logout = logout;
module.exports.signup = signup;
module.exports.getToken = getToken;
module.exports.changePassword = changePassword;
