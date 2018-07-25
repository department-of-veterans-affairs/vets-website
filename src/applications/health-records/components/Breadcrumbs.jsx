import { Link } from 'react-router';
import React from 'react';
import Breadcrumbs from '@department-of-veterans-affairs/formation/Breadcrumbs';

class HrBreadcrumbs extends React.Component {
  render() {
    const { location: { pathname } } = this.props;
    const crumbs = [
      <a href="/" key="home">Home</a>,
      <a href="/health-care/" key="healthcare">Health Care</a>,
      <Link to="/" key="main">Get Your VA Health Records</Link>
    ];

    if (pathname.match(/download\/?$/)) {
      crumbs.push(<Link to="/download" key="download">Download Your Health Records</Link>);
    }

    return (
      <Breadcrumbs>
        {crumbs}
      </Breadcrumbs>
    );
  }
}

export default HrBreadcrumbs;
