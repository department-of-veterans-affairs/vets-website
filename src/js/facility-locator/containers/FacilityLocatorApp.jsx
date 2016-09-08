import React from 'react';

class FacilityLocatorApp extends React.Component {
  render() {
    return (
      <div>
        <div className="primary row">
          <nav className="va-nav-breadcrumbs">
            <ul className="row va-nav-breadcrumbs-list" role="menubar" aria-label="Primary">
              <li><a href="/">Home</a></li>
              <li className="active">
                Facility Locator
              </li>
            </ul>
          </nav>
          <h3>Facility Locator</h3>
        </div>
        <div>
          {this.props.children}
        </div>
      </div>
    );
  }
}

export { FacilityLocatorApp };
