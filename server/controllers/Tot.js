const models = require('../models');

const { Tot } = models;

const makerPage = (req, res) => {
  Tot.TotModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.render('app', { csrfToken: req.csrfToken(), tots: docs });
  });
};

const voterPage = (req, res) => {
  Tot.TotModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.render('vote', { csrfToken: req.csrfToken(), tots: docs });
  });
};

const makeTot = (req, res) => {
  if (!req.body.item1 || !req.body.item2) {
    return res.status(400).json({ error: 'Both item1 and item2 are required' });
  }

  const totData = {
    name: req.body.item1 + req.body.item2,
    item1: req.body.item1,
    item2: req.body.item2,
    wins1: 0,
    wins2: 0,
    owner: req.session.account._id,
  };

  const newTot = new Tot.TotModel(totData);

  const totPromise = newTot.save();

  totPromise.then(() => res.json({ redirect: '/maker' }));

  totPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Tot already exists.' });
    }

    return res.status(400).json({ error: 'An error occurred' });
  });

  return totPromise;
};

const voteTot = (req, res) => {
  if (!req.body.item1 || !req.body.item2) {
    return res.status(400).json({ error: 'Both item1 and item2 are required' });
  }

  const totData = {
    name: req.body.item1 + req.body.item2,
    item1: req.body.item1,
    item2: req.body.item2,
    wins1: 0,
    wins2: 0,
    owner: req.session.account._id,
  };

  const newTot = new Tot.TotModel(totData);

  const totPromise = newTot.save();

  totPromise.then(() => res.json({ redirect: '/voter' }));

  totPromise.catch((err) => {
    console.log(err);
    return res.status(400).json({ error: 'An error occurred' });
  });

  return totPromise;
};


const getTots = (request, response) => {
  const req = request;
  const res = response;

  return Tot.TotModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.json({ tots: docs });
  });
};

/*
/ ADDED - getTot
/ based on getTots above, gets one tot from any user for voting
*/
const getTot = (request, response) => {
  const req = request;
  const res = response;

  return Tot.TotModel.findOne((err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.json({ tot: docs });
  });
};

/* 
/ To add: getAllTots for admin page
*/

module.exports.makerPage = makerPage;
module.exports.getTots = getTots;
module.exports.getTot = getTot;
module.exports.make = makeTot;
module.exports.voterPage = voterPage;
module.exports.vote = voteTot;
