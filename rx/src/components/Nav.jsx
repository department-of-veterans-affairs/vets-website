import React from 'react';
import { IndexLink, Link } from 'react-router';

class Nav extends React.Component {
  render() {
    return (
      <div>
        <IndexLink to="/">Home</IndexLink>
        <span> | </span>
        <Link to="/landing">Landing Page</Link>
        <span> | </span>
        <Link to="/page2">Page 2</Link>
      </div>
    );
  }
}

export default Nav;
