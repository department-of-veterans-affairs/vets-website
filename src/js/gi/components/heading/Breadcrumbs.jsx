import { Link, browserHistory } from 'react-router';
import React from 'react';

class Breadcrumbs extends React.Component {
  render() {
    const { location: { pathname } } = this.props;

    const crumbs = [
      <a href="/" key="home">Home</a>,
      <a href="/education" key="education">Education Benefits</a>,
      <a href="/education/gi-bill" key="gi-bill">GI Bill</a>,
    ];

    if (pathname.match(/search|profile/)) {
      crumbs.push(<Link to="/" key="main">GI Bill Comparison Tool</Link>);
    } else {
      crumbs.push(<span key="gibct"><strong>GI Bill Comparison Tool</strong></span>);
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

    return (<div className="gi-breadcrumbs">
      {crumbs.reduce((content, e) => { return [...content, ' › ', e]; }, []).slice(1)}
    </div>);
  }
}

Breadcrumbs.propTypes = {
  profileName: React.PropTypes.string
};

export default Breadcrumbs;
