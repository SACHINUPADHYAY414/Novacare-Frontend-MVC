import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { store, persistor } from './Redux/store.js';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { ToastrProvider } from "./Components/Toastr/ToastrProvider.jsx";
import { BrowserRouter } from "react-router-dom";
import "./sass/style.scss";
import "./sass/custom.scss";
import { createRoot } from "react-dom/client";
import "@popperjs/core";
import 'rsuite/dist/rsuite.min.css';


createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ToastrProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ToastrProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
