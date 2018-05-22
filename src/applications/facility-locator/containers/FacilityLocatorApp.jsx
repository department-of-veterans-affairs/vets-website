import { connect } from 'react-redux';
import { Link } from 'react-router';
import React from 'react';
import Breadcrumbs from '../../../platform/utilities/ui/Breadcrumbs';
import DowntimeNotification, { services } from '../../../platform/monitoring/DowntimeNotification';

class FacilityLocatorApp extends React.Component {
  render() {
    const { selectedFacility } = this.props;
    const crumbs = [
      <a href="/" key="0">Home</a>,
      <Link to="/" key="facility-locator">Facility Locator</Link>
    ];

    if (location.pathname.match(/facility\/[a-z]+_\d/) && selectedFacility) {
      crumbs.push(<a href={`/facilities/${selectedFacility.id}`} key="2">Facility Detail</a>);
    }

    return (
      <div>
        <div className="row">
          <div className="title-section">
            <Breadcrumbs selectedFacility={selectedFacility}>
              {crumbs}
            </Breadcrumbs>
          </div>
          <DowntimeNotification appTitle="facility locator tool" dependencies={[services.arcgis]}>
            <div className="facility-locator">
              {this.props.children}
            </div>
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

export default connect(mapStateToProps, null)(FacilityLocatorApp);
