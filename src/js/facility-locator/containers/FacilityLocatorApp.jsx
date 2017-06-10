import { connect } from 'react-redux';
import { Link } from 'react-router';
import React from 'react';

class FacilityLocatorApp extends React.Component {
  renderBreadcrumbs() {
    const { location, selectedFacility } = this.props;

    if (location.pathname.match(/facility\/[a-z]+_\d/) && selectedFacility) {
      return (
        <ul className="row va-nav-breadcrumbs-list" role="menubar" aria-label="Primary">
          <li><a href="/">Home</a></li>
          <li>
            <Link to="/">
              Facility Locator
            </Link>
          </li>
          <li className="active">
            {selectedFacility.attributes.name}
          </li>
        </ul>
      );
    }

    return (
      <ul className="row va-nav-breadcrumbs-list" role="menubar" aria-label="Primary">
        <li><a href="/">Home</a></li>
        <li className="active">
          Facility Locator
        </li>
      </ul>
    );
  }

  render() {
    return (
      <div>
        <div className="row">
          <div className="title-section">
            <nav className="va-nav-breadcrumbs">
                {this.renderBreadcrumbs()}
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

function mapStateToProps(state) {
  return {
    selectedFacility: state.facilities.selectedFacility,
  };
}

export default connect(mapStateToProps, null)(FacilityLocatorApp);
