const { MongoClient } = require('mongodb');
const config = require('./dbConfig.json');

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);
const db = client.db('startup');
const userCollection = db.collection('user');
const householdCollection = db.collection('household');

// This will asynchronously test the connection and exit the process if it fails
(async function testConnection() {
  try {
    await db.command({ ping: 1 });
    console.log(`Connect to database`);
  } catch (ex) {
    console.log(`Unable to connect to database with ${url} because ${ex.message}`);
    process.exit(1);
  }
})();

function getUser(email) {
  return userCollection.findOne({ email: email });
}

function getUserByToken(token) {
  return userCollection.findOne({ token: token });
}

async function addUser(user) {
  await userCollection.insertOne(user);
}

async function updateUser(user) {
  await userCollection.updateOne({ email: user.email }, { $set: user });
}

async function updateUserRemoveAuth(user) {
  await userCollection.updateOne({ email: user.email }, { $unset: { token: 1 } });
}

function getHouseholds(email) {
  return householdCollection.find({ members: email }).toArray();
}

function getHouseholdById(id) {
  return householdCollection.findOne({ id: id });
}

function getHouseholdByCode(code) {
  return householdCollection.findOne({ code: code });
}

async function addHousehold(household) {
  await householdCollection.insertOne(household);
}

async function updateHousehold(household) {
  await householdCollection.updateOne({ id: household.id }, { $set: household });
}

module.exports = {
  getUser,
  getUserByToken,
  addUser,
  updateUser,
  updateUserRemoveAuth,
  getHouseholds,
  getHouseholdById,
  getHouseholdByCode,
  addHousehold,
  updateHousehold,
};
