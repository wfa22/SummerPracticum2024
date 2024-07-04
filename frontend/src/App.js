// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import ParseForm from './ParseForm';
import VacancyList from './VacancyList';
import './App.css';

const App = () => {
  return (
    <Router>
      <div className="App">
        <nav>
          <ul>
            <li>
              <Link to="/">Parse Vacancies</Link>
            </li>
            <li>
              <Link to="/vacancies">View Vacancies</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route exact path="/" element={<ParseForm />} />
          <Route path="/vacancies" element={<VacancyList />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
