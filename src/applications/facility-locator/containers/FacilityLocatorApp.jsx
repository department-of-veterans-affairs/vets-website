import { connect } from 'react-redux';
import { Link, browserHistory } from 'react-router';
import React from 'react';
import DowntimeNotification, { externalServices } from '../../../platform/monitoring/DowntimeNotification';
import Breadcrumbs from '@department-of-veterans-affairs/formation/Breadcrumbs';

const goBackHistory = (e) => {
  e.preventDefault();
  browserHistory.goBack();
};

class FacilityLocatorApp extends React.Component {
  renderBreadcrumbs(location, selectedResult) {
    const crumbs = [
      <a href="/" key="home">Home</a>,
      <Link onClick={goBackHistory} key="facility-locator">Find Facilities & Services</Link>
    ];

    if (location.pathname.match(/facility\/[a-z]+_\d/) && selectedResult) {
      crumbs.push(<Link to={`/${selectedResult.id}`} key={selectedResult.id}>Facility Details</Link>);
    } else if (location.pathname.match(/provider\/[a-z]+_\d/) && selectedResult) {
      crumbs.push(<Link to={`/${selectedResult.id}`} key={selectedResult.id}>Provider Details</Link>);
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
