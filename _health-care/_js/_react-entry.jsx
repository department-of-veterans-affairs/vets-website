import React from 'react';
import ReactDOM from 'react-dom';
import { IndexLink, Link, Route, Router, hashHistory } from 'react-router'

class Nav extends React.Component {
  render() {
    return (
      <div>
        <Link to="/hello">Hello</Link><br/>
        <Link to="/night">Night</Link><br/>
        <IndexLink to="/">Home</IndexLink>
      </div>
      );
  }
}

class Hello extends React.Component {
  render() {
    return(
      <div>
        <h2>Hello World</h2>
        <Nav/>
      </div>
      );
  }
}

class Night extends React.Component {
  render() {
    return (
      <div>
        <h2>Goodnight World</h2>
        <Nav/>
      </div>
      );
  }
}

class App extends React.Component {
  render()  {
    return (
        <div>
          <h1>Top-Level of App</h1>
          <Nav/>
          {this.props.children}
        </div>
      )
  }
}

function init() {
  ReactDOM.render((
      <Router history={hashHistory}>
        <Route path="/" component={App}>
          <Route path="/hello" component={Hello}/>
          <Route path="/night" component={Night}/>
        </Route>
      </Router>
      ), document.getElementById('react-root'));
}

export { init };
