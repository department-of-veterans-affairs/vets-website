import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import DowntimeNotification, { services } from '../../../platform/monitoring/DowntimeNotification';
import MHVApp from '../../common/containers/MHVApp';
import Breadcrumbs from '../../../platform/utilities/ui/Breadcrumbs';
import RequiredLoginView from '../../common/components/RequiredLoginView';
import { closeRefillModal, closeGlossaryModal } from '../actions/modals';
import { refillPrescription } from '../actions/prescriptions';
import ConfirmRefillModal from '../components/ConfirmRefillModal';
import GlossaryModal from '../components/GlossaryModal';

const SERVICE_REQUIRED = 'rx';

const AppContent = ({ children }) => (
  <div className="rx-app">
    <div className="row">
      <div className="columns small-12">
        {children}
      </div>
    </div>
  </div>
);

class RxRefillsApp extends React.Component {
  render() {
    const { location: { pathname }, prescription } = this.props;

    const crumbs = [
      <a href="/" key="home">Home</a>,
      <a href="/health-care/" key="healthcare">Health Care</a>,
      <Link to="/" key="prescriptions">Prescription Refills</Link>
    ];

    if (pathname.match(/\/\d+$/)) {
      if (this.state.prevPath.match(/\/history\/?$/)) {
        crumbs.push(<Link to="/history" key="history">History</Link>);
      }
    } else if (pathname.match(/\/track\/?$/)) {
      if (this.state.prevPath.match(/\/history\/?$/)) {
        crumbs.push(<Link to="/history" key="history">History</Link>);
      }

      if (prescription) {
        const prescriptionId = _.get(
          prescription,
          ['rx', 'attributes', 'prescriptionId']
        );

        const prescriptionName = _.get(
          prescription,
          ['rx', 'attributes', 'prescriptionName']
        );

        crumbs.push(<Link to={`/${prescriptionId}`} key="history">{prescriptionName}</Link>);
      } else if (pathname.match(/\/history\/?$/)) {
        crumbs.push(<Link to="/history" key="history">History</Link>);
      } else if (pathname.match(/\/glossary\/?$/)) {
        crumbs.push(<Link to="/glossary" key="prescriptions">Glossary</Link>);
      } else if (pathname.match(/\/settings\/?$/)) {
        crumbs.push(<Link to="/settings" key="prescriptions">Settings</Link>);
      }
    }

    return (
      <RequiredLoginView
        verify
        serviceRequired={SERVICE_REQUIRED}
        user={this.props.user}>
        <DowntimeNotification appTitle="prescription refill tool" dependencies={[services.mhv]}>
          <AppContent>
            <Breadcrumbs>
              {crumbs}
            </Breadcrumbs>
            <MHVApp serviceRequired={SERVICE_REQUIRED}>
              {this.props.children}
              <ConfirmRefillModal
                prescription={this.props.refillModal.prescription}
                isLoading={this.props.refillModal.loading}
                isVisible={this.props.refillModal.visible}
                refillPrescription={this.props.refillPrescription}
                onCloseModal={this.props.closeRefillModal}/>
              <GlossaryModal
                content={this.props.glossaryModal.content}
                isVisible={this.props.glossaryModal.visible}
                onCloseModal={this.props.closeGlossaryModal}/>
            </MHVApp>
          </AppContent>
        </DowntimeNotification>
      </RequiredLoginView>
    );
  }
}

RxRefillsApp.propTypes = {
  children: PropTypes.element
};

const mapStateToProps = (state) => {
  const rxState = state.health.rx;
  const { modals, prescriptions } = rxState;

  return {
    glossaryModal: modals.glossary,
    refillModal: modals.refill,
    prescription: prescriptions.currentItem,
    user: state.user
  };
};

const mapDispatchToProps = {
  closeGlossaryModal,
  closeRefillModal,
  refillPrescription
};

export default connect(mapStateToProps, mapDispatchToProps)(RxRefillsApp);
