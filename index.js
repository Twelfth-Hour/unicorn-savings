const express = require("express");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");

let serviceAccount = require("./config/serviceAccountKey.json");
const app = express();

// Setup for Body Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Initialize Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
let db = admin.firestore();

// Add user details in firebase store
/* eslint-disable-next-line no-unused-vars */
app.post("/users/add", (req, res) => {
  const userModel = req.body;
  let userRef = db.collection("users").doc(userModel.id);
  /* eslint-disable-next-line no-unused-vars */
  let setUser = userRef.set({
    name: userModel.name,
    email: userModel.email,
    is_new: userModel.is_new,
    pet: userModel.pet,
    target: userModel.target,
    daily: userModel.daily,
    savings: userModel.savings
  });
});

//Add pet details in firebase store
/* eslint-disable-next-line no-unused-vars */
app.post("/pets/add", (req, res) => {
  const petModel = req.body;
  let petRef = db.collection("pets").doc();
  /* eslint-disable-next-line no-unused-vars */
  let petUser = petRef.set({
    owner: petModel.owner,
    name: petModel.name,
    hp: petModel.hp,
    xp: petModel.xp,
    level: petModel.level
  });
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}`));
