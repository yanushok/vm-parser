import React from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import MainPage from 'pages/main';
import Header from 'components/Header';

import './App.scss';
import { StateProvider } from 'contexts/state';

function App() {
  return (
    <StateProvider>
      <Router>
        <div className="container">
          <Switch>
            <Route path="/" exact children={<Header>Task List</Header>} />
            <Route path="/add-task" children={<Header>Add Task</Header>} />
          </Switch>

          <main className="main">
            <Switch>
              <Route path="/" exact component={MainPage} />
              <Route path="/add-task" children={<h1>azazazaza</h1>} />
            </Switch>
          </main>
        </div>
      </Router>
    </StateProvider>
  );
}

export default App;
