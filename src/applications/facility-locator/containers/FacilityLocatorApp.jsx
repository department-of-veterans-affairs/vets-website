import { connect } from 'react-redux';
import React from 'react';
import DowntimeNotification, { externalServices } from '../../../platform/monitoring/DowntimeNotification';
import FlBreadcrumbs from '../components/Breadcrumbs';

class FacilityLocatorApp extends React.Component {
  render() {
    const { location, selectedFacility } = this.props;

    return (
      <div>
        <FlBreadcrumbs location={location} selectedFacility={selectedFacility}/>
        <div className="row">
          <DowntimeNotification appTitle="facility locator tool" dependencies={[externalServices.arcgis]}>
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
