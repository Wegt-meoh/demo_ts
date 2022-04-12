import React from 'react';
import * as ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

//in ts strict mode it can not be work
const root=ReactDOM.createRoot(document.getElementById('root'))
root.render(<BrowserRouter><App/></BrowserRouter>)