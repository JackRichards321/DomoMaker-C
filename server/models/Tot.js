const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const _ = require('underscore');

let TotModel = {};

// mongoose.Types.ObjectID is a function that
// converts string ID to real mongo ID
const convertId = mongoose.Types.ObjectId;
const setName = (id) => _.escape(id).trim();

const TotSchema = new mongoose.Schema({
  id: {
    type: String,
    required: false,
    trim: true,
    set: setName,
  },

  name: {
    type: String,
    required: true,
    trim: true,
  },

  item1: {
    type: String,
    required: true,
    trim: true,
  },

  item2: {
    type: String,
    required: true,
    trim: true,
  },

  wins1: {
    type: Number,
    min: 0,
    default: 0,
  },

  wins2: {
    type: Number,
    min: 0,
    default: 0,
  },

  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },

  createdData: {
    type: Date,
    default: Date.now,
  },
});

TotSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  item1: doc.item1,
  item2: doc.item2,
  wins1: doc.wins1,
  wins2: doc.wins2,
});

TotSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  return TotModel.find(search).select('item1 item2').lean().exec(callback);
};

TotSchema.statics.findOne = (callback) => {
  return TotModel.find().select('item1 item2').lean().exec(callback);
};

TotModel = mongoose.model('Tot', TotSchema);

module.exports.TotModel = TotModel;
module.exports.TotSchema = TotSchema;
