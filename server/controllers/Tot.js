// const { get } = require('underscore');
const models = require('../models');


const { Tot } = models;

const makerPage = (req, res) => {
  Tot.TotModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred. Code: 1' });
    }

    return res.render('app', { csrfToken: req.csrfToken(), tots: docs });
  });
};

const voterPage = (req, res) => {
  Tot.TotModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred. Code: 2' });
    }

    return res.render('vote', { csrfToken: req.csrfToken(), tots: docs });
  });
};

const adminPage = (req, res) => {
  Tot.TotModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred. Code: 8' });
    }

    return res.render('admin', { csrfToken: req.csrfToken(), tots: docs });
  });
};

const errorPage = (req, res) => {
  return res.render('error');
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

    return res.status(400).json({ error: 'An error occurred. Code: 3' });
  });

  return totPromise;
};

/*
/ ADDED - voteTot
/ based on makeTot above, handles a users vote and increments that item's wins property
*/
const voteTot = (req, res) => {
  // console.log("req.body: ");
  // console.log(req.body);

  if (!req.body.item) {
    return res.status(400).json({ error: 'Choose an option before voting!' });
  }

  const callback = (error, data) => {
    if (error) {
      console.log(error);
    } else {
      // console.log("data 1: ");
      // console.log(data);
      return data;
    }
    return false;
  };

  if (req.body.item === req.body.item1) {
    // console.log("item 1 updated");

    Tot.TotModel.findOneAndUpdate(
      { _id: req.body.id },
      { $inc: { wins1: 1 } },
      callback,
    );

    res.json({ redirect: '/voter' });
  } else if (req.body.item === req.body.item2) {
    // console.log("item 2 updated");
    // console.log(req.body.wins2);

    Tot.TotModel.findOneAndUpdate(
      { _id: req.body.id },
      { $inc: { wins2: 1 } },
      callback,
    );

    res.json({ redirect: '/voter' });
  }

  return false;
};


const getTots = (request, response) => {
  const req = request;
  const res = response;

  return Tot.TotModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred. Code: 5' });
    }

    return res.json({ tots: docs });
  });
};

/*
/ ADDED - getTot
/ based on getTots above, gets one tot from any user for voting
*/
const getTot = (request, response) => {
  // const req = request;
  const res = response;

  return Tot.TotModel.findAll((err, docs) => {
    // console.log("docs: ");
    // console.log(docs);

    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred. Code: 6' });
    }

    const randomTot = docs[Math.floor(Math.random() * docs.length)];

    return res.json({ tot: randomTot });
  });
};

/*
/ To add: getAllTots for admin page
*/
const getAllTots = (request, response) => {
  const req = request;
  const res = response;

  return Tot.TotModel.findAll((err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred. Code: 7' });
    }

    // console.log("docs: ");
    // console.log(docs);

    return res.json({ csrfToken: req.csrfToken(), tots: docs });
  });
};

const deleteTot = (request, response) => {
  const req = request;
  const res = response;

  console.log("req.body: ");
  console.log(req.body);

  return Tot.TotModel.deleteOne({id: req.body._id}, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred. Code: 9' });
    }

    return res.json({ tots: docs });
  });
};

module.exports.makerPage = makerPage;
module.exports.getTots = getTots;
module.exports.getTot = getTot;
module.exports.getAllTots = getAllTots;
module.exports.deleteTot = deleteTot;
module.exports.make = makeTot;
module.exports.voterPage = voterPage;
module.exports.vote = voteTot;
module.exports.adminPage = adminPage;
module.exports.errorPage = errorPage;
