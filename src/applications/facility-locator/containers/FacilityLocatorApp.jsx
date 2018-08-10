import { connect } from 'react-redux';
import { Link } from 'react-router';
import React from 'react';
import DowntimeNotification, { externalServices } from '../../../platform/monitoring/DowntimeNotification';
import Breadcrumbs from '@department-of-veterans-affairs/formation/Breadcrumbs';

class FacilityLocatorApp extends React.Component {
  renderBreadcrumbs(location, selectedResult) {
    const crumbs = [
      <a href="/" key="home">Home</a>,
      <Link to="/" key="facility-locator">Facility Locator</Link>
    ];

    if (location.pathname.match(/facility\/[a-z]+_\d/) && selectedResult) {
      crumbs.push(<Link to={`/${selectedResult.id}`} key={selectedResult.id}>Facility Details</Link>);
    }

    return crumbs;
  }

  render() {
    const { location, selectedResult } = this.props;

    return (
      <div>
        <Breadcrumbs selectedFacility={selectedResult}>
          {this.renderBreadcrumbs(location, selectedResult)}
        </Breadcrumbs>
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
    selectedResult: state.searchResult.selectedResult,
  };
}

export default connect(mapStateToProps, null)(FacilityLocatorApp);
