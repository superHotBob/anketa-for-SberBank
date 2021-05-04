import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route } from "react-router-dom"
import "./index.css";
import App from "./App";

import reportWebVitals from "./reportWebVitals";
import newAnketa from "./pages/newAnketa";
import Anketa from "./pages/editAnketa";
import Sign from "./pages/signin";

ReactDOM.render( 
    <BrowserRouter>
      <Route path="/" exact component={App} />
      <Route path="/editanketa" component={Anketa} /> 
      <Route path="/newanketa"  component={newAnketa} />       
      <Route path="/sign" component={Sign} />
    </BrowserRouter>, 
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
