import React, { useReducer } from "react";
import { CreateRoom } from "./pages/CreateRoom";
import { JoinRoom } from "./pages/JoinRoom";
import { reducer, defaultState } from "./reducers";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

const App = () => {
  const store = useReducer(reducer, defaultState);
  return (
    <Router>
      <Switch>
        <Route path="/:roomID">
          <JoinRoom store={store} />
        </Route>
        <Route path="/">
          <CreateRoom store={store} />
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
