import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore } from "redux";
import * as firebase from "firebase";

import firebaseConfig from "./config/firebase.config";
import reducers from "./reducers";
import App from "./App";

const store = createStore(reducers);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);

firebase.initializeApp(firebaseConfig);
