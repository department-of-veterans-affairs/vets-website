import { connect } from 'react-redux';
import React from 'react';
import Breadcrumbs from '../components/Breadcrumbs';
import DowntimeNotification, { services } from '../../common/containers/DowntimeNotification';
import { buildMobileBreadcrumb, debouncedToggleLinks } from '../../utils/breadcrumb-helper';

class FacilityLocatorApp extends React.Component {
  componentDidMount() {
    buildMobileBreadcrumb('va-breadcrumbs-facility', 'va-breadcrumbs-facility-list');

    window.addEventListener('DOMContentLoaded', () => {
      buildMobileBreadcrumb.bind(this);
    });

    window.addEventListener('resize', () => {
      debouncedToggleLinks('va-breadcrumbs-facility-list');
      debouncedToggleLinks.bind(this);
    });
  }

  componentDidUpdate() {
    buildMobileBreadcrumb('va-breadcrumbs-facility', 'va-breadcrumbs-facility-list');

    window.addEventListener('DOMContentLoaded', () => {
      buildMobileBreadcrumb.bind(this);
    });
  }

  componentWillUnmount() {
    window.removeEventListener('DOMContentLoaded', () => {
      buildMobileBreadcrumb.bind(this);
    });

    window.removeEventListener('resize', () => {
      debouncedToggleLinks.bind(this);
    });
  }

  render() {
    const { selectedFacility } = this.props;

    return (
      <div>
        <div className="row">
          <div className="title-section">
            <Breadcrumbs selectedFacility={selectedFacility}/>
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
