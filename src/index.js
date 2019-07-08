import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';

const myTarget = document.getElementById('reactJS').getAttribute('container'); //gal
ReactDOM.render(<App/>, document.getElementById(myTarget));

module.hot.accept();