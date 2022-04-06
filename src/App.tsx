import React from 'react';
import './App.css';
import { Routes, Route, Link } from 'react-router-dom';

import Login from './pages/Login';
import Shower from './pages/Shower';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route index element={<Link to='/login'>login</Link>} />
        <Route path='/login' element={<Login />} />
        <Route path='/shower' element={<Shower />} />
        <Route path='*' element={<NoMatchPage />}/>
      </Routes>
    </div>
  );
}

function NoMatchPage(){
  return  (
    <div>
      <h2>No such Page, please check your url.</h2>
    </div>
  )
}

export default App;