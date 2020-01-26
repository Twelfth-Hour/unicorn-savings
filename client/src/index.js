import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore } from "redux";
import * as firebase from "firebase";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage
import { PersistGate } from "redux-persist/integration/react";

import firebaseConfig from "./config/firebase.config";
import reducers from "./reducers";
import App from "./App";

const persistConfig = {
  key: "root",
  storage
};
const persistedReducers = persistReducer(persistConfig, reducers);
const store = createStore(persistedReducers);

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistStore(store)}>
      <App />
    </PersistGate>
  </Provider>,
  document.getElementById("root")
);

firebase.initializeApp(firebaseConfig);
