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
app.post("/user/set", (req, res) => {
  let userModel = req.body;
  db.collection("users")
    .doc(userModel.id)
    .get()
    .then(doc => {
      if (!doc.exists) {
        // new user save to db
        db.collection("users")
          .doc(userModel.id)
          .set(userModel, { merge: true });
        res.send(userModel);
      } else {
        // existing user get data from db
        res.send(doc.data());
      }
    });
});

//Add pet details in firebase store
/* eslint-disable-next-line no-unused-vars */
app.post("/pet/set", (req, res) => {
  const petModel = req.body;
  let petRef = db.collection("pets").doc();
  /* eslint-disable-next-line no-unused-vars */
  let petUser = petRef.set(petModel, { merge: true });
});

//Send pet details back to client side
/* eslint-disable-next-line no-unused-vars */
app.post("/pet/get/:email", (req, res) => {
  let email = req.params.email;
  /* eslint-disable-next-line no-unused-vars */
  let petQuery = db
    .collection("pets")
    .where("owner", "==", email)
    .get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        res.send(doc.data());
      });
    });
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}`));
