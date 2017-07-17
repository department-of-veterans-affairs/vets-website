import { Link } from 'react-router';
import React from 'react';

class Breadcrumbs extends React.Component {
  render() {
    const { location: { pathname } } = this.props;

    const crumbs = [
      <a href="/" key="home">Home</a>,
      <a href="/disability-benefits" key="disability-benefits">Disability Benefits</a>,
    ];

    if (pathname.match(/status\/?$/)) {
      crumbs.push(<Link to="/" key="main">Your Claims and Appeals</Link>);
      crumbs.push(<span key="status"><strong>Your Compensation Appeal Status</strong></span>);
    } else if (pathname.match(/learn-more\/?$/)) {
      crumbs.push(<span key="learn-more"><strong>Appeals</strong></span>);
    } else {
      crumbs.push(<span key="main"><strong>Your Claims and Appeals</strong></span>);
    }

    return (<div className="db-breadcrumbs">
      {crumbs.reduce((content, e) => { return [...content, ' › ', e]; }, []).slice(1)}
    </div>);
  }
}

export default Breadcrumbs;
