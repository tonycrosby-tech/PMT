import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = ({ component: Component, LoggedIn, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        LoggedIn ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
};

export default PrivateRoute;
// import React from "react";
// import { Route, Redirect } from "react-router-dom";
// import Subscription from "../pages/Subscription";

// const PrivateRoute = ({ component: Component, ...rest }) => (
//     <Route {...rest} render={(props) => (
//         console.log(props),
//             props.location.loggedIn === true
//             ? <Route path="/subscription" component={Subscription} />
//             : <Redirect to={{
//                 pathname: '/',
//                 state: { from: props.location }
//             }} />
//     )} />
// );

// export default PrivateRoute;
