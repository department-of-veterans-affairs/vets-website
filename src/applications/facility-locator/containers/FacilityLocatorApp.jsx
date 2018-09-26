import { connect } from 'react-redux';
import { Link } from 'react-router';
import React from 'react';
import DowntimeNotification, {
  externalServices,
} from '../../../platform/monitoring/DowntimeNotification';
import Breadcrumbs from '@department-of-veterans-affairs/formation/Breadcrumbs';

class FacilityLocatorApp extends React.Component {
  renderBreadcrumbs(location, selectedFacility) {
    const crumbs = [
      <a href="/" key="home">
        Home
      </a>,
      <Link to="/" key="facility-locator">
        Facility Locator
      </Link>,
    ];

    if (location.pathname.match(/facility\/[a-z]+_\d/) && selectedFacility) {
      crumbs.push(<Link to={`/${selectedFacility.id}`}>Facility Details</Link>);
    }

    return crumbs;
  }

  render() {
    const { location, selectedFacility } = this.props;

    return (
      <div>
        <Breadcrumbs selectedFacility={selectedFacility}>
          {this.renderBreadcrumbs(location, selectedFacility)}
        </Breadcrumbs>
        <div className="row">
          <DowntimeNotification
            appTitle="facility locator tool"
            dependencies={[externalServices.arcgis]}
          >
            <div className="facility-locator">{this.props.children}</div>
          </DowntimeNotification>
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

export default connect(
  mapStateToProps,
  null,
)(FacilityLocatorApp);
