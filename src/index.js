//INFO: entrada a la aplicacion, solo cargar estilos, fonts, ...
import React from "react";
import ReactDOM from "react-dom";

import "@fontsource/roboto"; //VER: https://material-ui.com/components/typography/#general
import "./index.css"; //U: lo que SEGURO es comun a todas las ideas, ej. margen 0, tipografia, etc.

import App from './prode/App'

ReactDOM.render(<App />, document.getElementById("root"));

