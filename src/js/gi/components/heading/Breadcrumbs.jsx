import { Link, browserHistory } from 'react-router';
import PropTypes from 'prop-types';
import React from 'react';

class Breadcrumbs extends React.Component {
  render() {
    const { pathname, query: { version } } = this.props.location;

    const crumbs = [
      <a href="/" key="home">Home</a>,
      <a href="/education" key="education">Education Benefits</a>,
      <a href="/education/gi-bill" key="gi-bill">GI Bill</a>,
    ];

    if (pathname.match(/search|profile/)) {
      const root = { pathname: '/', query: (version ? { version } : {}) };
      crumbs.push(<Link to={root} key="main">GI Bill® Comparison Tool</Link>);
    } else {
      crumbs.push(<span key="gibct"><strong>GI Bill® Comparison Tool</strong></span>);
    }

    if (pathname.match(/search\/?$/)) {
      crumbs.push(<span key="search-results"><strong>Search Results</strong></span>);
    }

    if (pathname.match(/profile/)) {
      if (true) { // TODO: if got here by searching
        crumbs.push(<a onClick={browserHistory.goBack} key="search-results">Search Results</a>);
      }
      crumbs.push(<span key="profile"><strong>{this.props.profileName || 'Profile'}</strong></span>);
    }

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
