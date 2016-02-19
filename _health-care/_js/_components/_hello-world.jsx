import React from 'react';
import { IndexLink, Link } from 'react-router'

import DateInput from './date_input.jsx';

class Nav extends React.Component {
  render() {
    return (
      <div>
        <Link to="/hello">Hello</Link><br/>
        <Link to="/night">Night</Link><br/>
        <IndexLink to="/">Home</IndexLink>
      </div>
    )
  }
}

class Hello extends React.Component {
  render() {
    return(
      <div>
        <h2>Hello World</h2>
        <div className="row">
          <h3>Happy Date</h3>
          <DateInput />
        </div>
        <div className="row">
          <h3>Sad Date</h3>
          <DateInput />
        </div>
      </div>
    )
  }
}

class Night extends React.Component {
  render() {
    return (
    <div>
      <h2>Goodnight World</h2>
    </div>
    )
  }
}

export { Hello, Nav, Night };
