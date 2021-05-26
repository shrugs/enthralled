import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { Book } from './pages/Book';
import { Dashboard } from './pages/Dashboard';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/dashboard">
          <Dashboard />
        </Route>
        <Route path="/:stack?">
          <Book />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
