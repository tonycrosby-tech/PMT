import React, { Component } from 'react';
import './index.css';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import SignInSide from './pages/SignIn';
// import About from './pages/About';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Project from './pages/Subscription';
import NotFoundPage from './pages/NotFoundPage';
import Profile from './pages/Profile';
import ProtectedRoute from './utils/PrivateRoute';
import axios from 'axios';
// import Footer from './components/Footer';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: true,
      username: null,
    };

    this.logout = this.logout.bind(this);
  }
  //   this.updateUser = this.updateUser.bind(this);
  //   this.getUser = this.getUser.bind(this);
  // }

  componentDidMount() {
    this.getUser();
  }

  updateUser(userObject) {
    this.setState(userObject);
  }

  getUser() {
    axios.get('/api/auth/user').then((response) => {
      if (response.data.user) {
        this.setState({
          loggedIn: true,
          username: response.data.user.username,
        });
      } else {
        this.setState({
          loggedIn: false,
          username: null,
        });
      }
    });
  }

  logout() {
    // Perform any logout logic here (e.g., clearing tokens)
    localStorage.removeItem('token'); // Adjust as necessary for your app
    this.setState({
      loggedIn: false,
      username: null,
    });
  };

  render() {
    return (
      <React.Fragment>
        <BrowserRouter>
          <Switch>
            <Route exact path="/" component={Signup} />
            <Route exact path="/login" component={SignInSide} />

            <ProtectedRoute
              LoggedIn={this.state.loggedIn}
              path="/profile"
              component={Profile}
            />
            <ProtectedRoute
              LoggedIn={this.state.loggedIn}
              path="/home"
              component={Home && Project}
            />
            
            <Route path="*" component={NotFoundPage} />
            <Redirect to="/404" />
          </Switch>
          {/* <Footer /> */}
        </BrowserRouter>
      </React.Fragment>
    );
  }
}

export default App;

