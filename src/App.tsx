import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Dashboard from './pages/Dashboard';
import Stats from './pages/Stats';

function App() {
  
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Stats/>}/>
          <Route path='/dashboard' element={<Dashboard/>}/>
          <Route path='/stats' element={<Stats/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
