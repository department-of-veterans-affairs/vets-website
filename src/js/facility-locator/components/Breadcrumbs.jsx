import React, { Component } from 'react';
import { Link } from 'react-router';

class Breadcrumbs extends Component {
  renderBreadcrumbs() {
    const { selectedFacility } = this.props;

    if (location.pathname.match(/facility\/[a-z]+_\d/) && selectedFacility) {
      return (
        <ul
          className="row va-nav-breadcrumbs-list"
          id="va-breadcrumbs-facility-list"
          role="menubar">
          <li><a href="/">Home</a></li>
          <li><Link to="/">Facility Locator</Link></li>
          <li><Link to={`/facility/${selectedFacility.id}`}>Facility Detail</Link></li>
        </ul>
      );
    }

    return (
      <ol
        className="row va-nav-breadcrumbs-list"
        id="va-breadcrumbs-facility-list">
        <li><a href="/">Home</a></li>
        <li><Link to="/">Facility Locator</Link></li>
      </ol>
    );
  }

  render() {
    return (
      <nav
        aria-label="Breadcrumb"
        aria-live="polite"
        aria-relevant="additions text"
        className="va-nav-breadcrumbs"
        id="va-breadcrumbs-facility">
        <p className="usa-sr-only">Breadcrumb navigation will usually show all page links. It will adjust to show only the previous page when zoomed in, or viewed on a mobile device.</p>
        { this.renderBreadcrumbs() }
      </nav>
    );
  }
}

export default Breadcrumbs;

