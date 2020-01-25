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
  const userModel = req.body;
  let userRef = db.collection("users").doc(userModel.id);
  /* eslint-disable-next-line no-unused-vars */
  let setUser = userRef.set(userModel, { merge: true });
  res.send("success");
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


// Update pet details based on the xp
/* eslint-disable-next-line no-unused-vars */
app.post("/pet/:email", (req, res) => {
    let email = req.params.email;
    let petLevel = db.collection("pets").where("owner", "==", email).get()
    .then(snapshot => {
        snapshot.forEach(doc => {
            let data = doc.data();
            if (req.body.xp >= (data.level * 5)) {
                let newLevel = req.body.level;
                db.collection("pets").where("owner", "==", email).set({
                    level: 
                })
            }            
        });
    });
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}`));
