import PropTypes from 'prop-types';
import React from 'react';

class Breadcrumbs extends React.Component {
  render() {
    const crumbs = [
      <a href="/" key="home">Home</a>,
      <a href="/education" key="education">Education Benefits</a>,
      <a href="/education/gi-bill" key="gi-bill">GI Bill</a>,
    ];

    return (
      <nav className="va-nav-breadcrumbs">
        <ul className="row va-nav-breadcrumbs-list columns" role="menubar" aria-label="Primary">
          {crumbs.map((c, i) => {
            return <li key={i}>{c}</li>;
          })}
        </ul>
      </nav>
    );
  }
}

Breadcrumbs.propTypes = {
  profileName: PropTypes.string
};

export default Breadcrumbs;
