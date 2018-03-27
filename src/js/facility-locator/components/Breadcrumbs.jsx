import React, { Component } from 'react';
import { Link } from 'react-router';

class Breadcrumbs extends Component {
  renderBreadcrumbs() {
    const { selectedFacility } = this.props;

    if (location.pathname.match(/facility\/[a-z]+_\d/) && selectedFacility) {
      return (
        <ul
          className="row va-nav-breadcrumbs-list"
          id="va-breadcrumb-facility-list"
          role="menubar">
          <li><a href="/">Home</a></li>
          <li><Link to="/">Facility Locator</Link></li>
          <li><Link to={`/facility/${selectedFacility.id}`}>{ `${selectedFacility.attributes.name}` }</Link></li>
        </ul>
      );
    }

    return (
      <ul
        className="row va-nav-breadcrumbs-list"
        id="va-breadcrumb-facility-list"
        role="menubar">
        <li><a href="/">Home</a></li>
        <li><Link to="/">Facility Locator</Link></li>
      </ul>
    );
  }

  render() {
    return (
      <nav
        aria-label="Breadcrumb"
        className="va-nav-breadcrumbs"
        id="va-breadcrumb-facility">
        { this.renderBreadcrumbs() }
      </nav>
    );
  }
}

export default Breadcrumbs;

