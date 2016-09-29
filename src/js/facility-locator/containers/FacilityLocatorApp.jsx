import { Link } from 'react-router';
import React from 'react';

class FacilityLocatorApp extends React.Component {
  renderBreadcrumbs() {
    const { location } = this.props;

    if (location.pathname.match(/facilities\/facility\/\d/)) {
      return (
        <span>
          <li>
            <Link to="/facilities">
              Facility Locator
            </Link>
          </li>
          <li className="active">
            Facility Details
          </li>
        </span>
      );
    }
    return (
      <li className="active">
        Facility Locator
      </li>
    );
  }

  render() {
    return (
      <div>
        <div className="row">
          <div className="title-section">
            <nav className="va-nav-breadcrumbs">
              <ul className="row va-nav-breadcrumbs-list" role="menubar" aria-label="Primary">
                <li><a href="/">Home</a></li>
                {this.renderBreadcrumbs()}
              </ul>
            </nav>
          </div>
          <div className="facility-locator">
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}

export { FacilityLocatorApp };
