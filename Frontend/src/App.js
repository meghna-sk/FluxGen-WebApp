import React, { useState, useCallback } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from 'react-router-dom';

import Managers from './manager/pages/Managers';
import NewApartment from './apartments/pages/NewApartment';
import ManagerApartments from './apartments/pages/ManagerApartments';
import UpdateApartment from './apartments/pages/UpdateApartment';
import Auth from './manager/pages/Auth';
import MainNavigation from './shared/components/Navigation/MainNavigation';
import { AuthContext } from './shared/context/auth-context';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [managerId, setManagerId] = useState(false);

  const login = useCallback(mid => {
    setIsLoggedIn(true);
    setManagerId(mid);
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    setManagerId(null);
  }, []);

  let routes;

  if (isLoggedIn) {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Managers />
        </Route>
        <Route path="/:managerId/apartments" exact>
          <ManagerApartments />
        </Route>
        <Route path="/apartments/new" exact>
          <NewApartment />
        </Route>
        <Route path="/apartments/:apartmentId">
          <UpdateApartment />
        </Route>
        <Redirect to="/" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Managers />
        </Route>
        <Route path="/:managerId/apartments" exact>
          <ManagerApartments />
        </Route>
        <Route path="/auth">
          <Auth />
        </Route>
        <Redirect to="/auth" />
      </Switch>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: isLoggedIn,
        managerId: managerId,
        login: login,
        logout: logout
      }}
    >
      <Router>
        <MainNavigation />
        <main>{routes}</main>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
