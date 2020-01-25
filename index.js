const express = require("express");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");
const pet = require("arkvatar-ts");

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
app.post("/user/set", (req, res) => {
  let userModel = req.body;
  db.collection("users")
    .doc(userModel.id)
    .get()
    .then(doc => {
      if (!doc.exists) {
        (async () => {
          // Crypto Type are the full name of a cryptocurrency, Ethereum or Ark for example.
          /* eslint-disable-next-line no-unused-vars */
          const response = await pet.store(userModel.email, "Ethereum");
        })();
        userModel.isNew = true;
        userModel.target = 0;
        userModel.daily = 0;
        userModel.savings = 0;
        // new user save to db
        db.collection("users")
          .doc(userModel.id)
          .set(userModel, { merge: true });
        res.send(userModel);
      } else {
        // existing user get data from db
        db.collection("users")
          .doc(userModel.id)
          .set(userModel, { merge: true });
        db.collection("users")
          .doc(userModel.id)
          .get()
          .then(doc => res.send(doc.data()));
      }
    });
});

//Add pet details in firebase store
app.post("/pet/set", (req, res) => {
  let petModel = req.body;
  db.collection("pets")
    .doc(petModel.owner)
    .get()
    .then(doc => {
      if (!doc.exists) {
        petModel.xp = 0;
        petModel.hp = 100;
        petModel.level = 0;
        // new pet save to db
        db.collection("pets")
          .doc(petModel.owner)
          .set(petModel, { merge: true });
        res.send(petModel);
      } else {
        // Calculating the level score based on xp
        petModel.level = (Math.sqrt(25 + 40 * petModel.xp) - 5) / 10;
        // existing user get data from db
        db.collection("pets")
          .doc(petModel.owner)
          .set(petModel, { merge: true });
        db.collection("pets")
          .doc(petModel.owner)
          .get()
          .then(doc => res.send(doc.data()));
      }
    });
});

//Send pet details back to client side
app.post("/pet/get/:email", (req, res) => {
  let email = req.params.email;
  /* eslint-disable-next-line no-unused-vars */
  let petQuery = db
    .collection("pets")
    .doc(email)
    .get()
    .then(doc => {
      if (doc.exists) {
        res.send(doc.data);
      }
    });
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}`));
