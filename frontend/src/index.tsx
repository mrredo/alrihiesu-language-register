import React from "react";
import ReactDOM from "react-dom";
import "./styles/tailwind.css";
import {App} from "./App";
import * as serviceWorker from "./serviceWorker";
import {createRoot} from "react-dom/client";

const container = document.getElementById("root");

// Create a root using createRoot
// @ts-ignore
const root = createRoot(container);

// Concurrently render your app
root.render(<App />);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
