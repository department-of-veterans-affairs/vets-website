import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import DowntimeNotification, { services } from '../../../platform/monitoring/DowntimeNotification';
import Modal from '@department-of-veterans-affairs/jean-pants/Modal';
import MHVApp from '../../common/containers/MHVApp';
import RequiredLoginView from '../../common/components/RequiredLoginView';
import { closeModal } from '../actions/modal';
import Breadcrumbs from '../../../platform/utilities/ui/Breadcrumbs';

const SERVICE_REQUIRED = 'health-records';

const AppContent = ({ children }) => (
  <div className="bb-app">
    <div className="row">
      <div className="columns small-12">
        {children}
      </div>
    </div>
  </div>
);

export class HealthRecordsApp extends React.Component {
  render() {
    const crumbs = [
      <a href="/" key="home">Home</a>,
      <a href="/health-care/" key="healthcare">Health Care</a>,
    ];

    if (location.pathname.match(/download\/?$/)) {
      crumbs.push(<Link to="/" key="main">Get Your VA Health Records</Link>);
      crumbs.push(<Link to="/" key="download">Download Your VA Health Records</Link>);
    } else {
      crumbs.push(<Link to="/" key="main">Get Your VA Health Records</Link>);
    }

    return (
      <RequiredLoginView
        verify
        serviceRequired={SERVICE_REQUIRED}
        user={this.props.user}>
        <DowntimeNotification appTitle="health records tool" dependencies={[services.mhv]}>
          <AppContent>
            <Breadcrumbs>
              {crumbs}
            </Breadcrumbs>
            <MHVApp serviceRequired={SERVICE_REQUIRED}>
              {this.props.children}
              <Modal
                cssClass="bb-modal"
                contents={this.props.modal.content}
                id="bb-glossary-modal"
                onClose={this.props.closeModal}
                title={this.props.modal.title}
                visible={this.props.modal.visible}/>
            </MHVApp>
          </AppContent>
        </DowntimeNotification>
      </RequiredLoginView>
    );
  }
}

HealthRecordsApp.propTypes = {
  children: PropTypes.element
};

const mapStateToProps = (state) => {
  const hrState = state.health.hr;

  return {
    modal: hrState.modal,
    user: state.user
  };
};
const mapDispatchToProps = {
  closeModal,
};

export default connect(mapStateToProps, mapDispatchToProps)(HealthRecordsApp);
