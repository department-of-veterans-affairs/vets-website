import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import DowntimeNotification, { externalServices } from '../../../platform/monitoring/DowntimeNotification';
import Breadcrumbs from '@department-of-veterans-affairs/formation/Breadcrumbs';
import Modal from '@department-of-veterans-affairs/formation/Modal';
import MHVApp from '../../../platform/user/authorization/containers/MHVApp';
import backendServices from '../../../platform/user/profile/constants/backendServices';
import RequiredLoginView from '../../../platform/user/authorization/components/RequiredLoginView';
import { closeModal } from '../actions/modal';
// import Breadcrumbs from '../components/Breadcrumbs';

const SERVICE_REQUIRED = backendServices.HEALTH_RECORDS;

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
  renderBreadcrumbs() {
    const { location: { pathname } } = this.props;

    const crumbs = [
      <a href="/" key="home">Home</a>,
      <a href="/health-care/" key="healthcare">Health Care</a>,
    ];

    if (pathname.match(/download\/?$/)) {
      crumbs.push(
        <Link to="/" key="main">Get Your VA Health Records</Link>,
        <Link to="/download/" key="download">Download Your Health Records</Link>
      );
    } else {
      crumbs.push(<Link to="/" key="main">Get Your VA Health Records</Link>);
    }

    return crumbs;
  }

  render() {
    return (
      <RequiredLoginView
        verify
        serviceRequired={SERVICE_REQUIRED}
        user={this.props.user}>
        <DowntimeNotification appTitle="health records tool" dependencies={[externalServices.mhv]}>
          <AppContent>
            <Breadcrumbs location={this.props.location}>
              {this.renderBreadcrumbs()}
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
