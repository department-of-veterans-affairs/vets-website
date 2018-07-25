import React from 'react';
import { Link } from 'react-router';
import Breadcrumbs from '@department-of-veterans-affairs/formation/Breadcrumbs';

class FlBreadcrumbs extends React.Component {
  render() {
    const { location, selectedFacility } = this.props;
    const crumbs = [
      <a href="/" key="home">Home</a>,
      <Link to="/" key="facility-locator">Facility Locator</Link>
    ];

    if (location.pathname.match(/facility\/[a-z]+_\d/) && selectedFacility) {
      crumbs.push(<Link to={`/${selectedFacility.id}`} key="facility-detail">Facility Details</Link>);
    }

    return (
      <Breadcrumbs>
        {crumbs}
      </Breadcrumbs>
    );
  }
}

export default FlBreadcrumbs;
