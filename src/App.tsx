import React from "react";
import "./app.scss";
import "rsuite/dist/rsuite.min.css";
import Router from "./Router";
import Toaster from "./components/Toaster";
import { Loader } from "./components/common/loading";

function App() {
  return (
    <>
      <Router />
      <Loader />
      <Toaster />
    </>
  );
}

export default App;
