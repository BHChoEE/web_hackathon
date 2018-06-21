import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import Login from './login.js';
import SignUp from './signup.js';
import Main from './main.js'

const App = () => (
    <BrowserRouter>
        <Switch>
            <Route exact path = "/" component={Login} />
            <Route path = "/signup" component={SignUp} />
            <Redirect from="/login" to="/" />
            <Route path = "/main/" component={Main} />
        </Switch>
    </BrowserRouter>
);

export default App;