import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import recordEvent from 'platform/monitoring/record-event';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';

import Breadcrumbs from '../components/Breadcrumbs';
import ScheduleNewAppointment from '../components/ScheduleNewAppointment';
import {
  fetchExpressCareWindows,
  closeCancelAppointment,
  confirmCancelAppointment,
  startNewAppointmentFlow,
} from '../actions/appointments';
import CancelAppointmentModal from '../components/cancel/CancelAppointmentModal';
import {
  getCancelInfo,
  vaosRequests,
  vaosPastAppts,
  vaosDirectScheduling,
  vaosCommunityCare,
  vaosExpressCare,
  isWelcomeModalDismissed,
  selectExpressCare,
} from '../utils/selectors';
import { selectIsCernerOnlyPatient } from 'platform/user/selectors';
import { GA_PREFIX, FETCH_STATUS } from '../utils/constants';
import { scrollAndFocus } from '../utils/scrollAndFocus';
import NeedHelp from '../components/NeedHelp';
import TabNav from '../components/TabNav';
import RequestExpressCare from '../components/RequestExpressCare';

const pageTitle = 'VA appointments';

export class AppointmentsPage extends Component {
  componentDidMount() {
    if (this.props.isWelcomeModalDismissed) {
      scrollAndFocus();
    }

    document.title = `${pageTitle} | Veterans Affairs`;
    this.props.fetchExpressCareWindows();
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.isWelcomeModalDismissed &&
      !prevProps.isWelcomeModalDismissed
    ) {
      scrollAndFocus();
    }
  }

  startNewAppointmentFlow = () => {
    recordEvent({
      event: `${GA_PREFIX}-schedule-appointment-button-clicked`,
    });
    this.props.startNewAppointmentFlow();
  };

  render() {
    const {
      cancelInfo,
      children,
      showScheduleButton,
      showCommunityCare,
      hasExpressCareAccess,
      expressCare,
      showDirectScheduling,
      isCernerOnlyPatient,
      showPastAppointments,
    } = this.props;
    const { fetchWindowsStatus, allowRequests } = expressCare;

    return (
      <div className="vads-l-grid-container vads-u-padding-x--2p5 large-screen:vads-u-padding-x--0 vads-u-padding-bottom--2p5">
        <Breadcrumbs />
        <div className="vads-l-row">
          <div className="vads-l-col--12 medium-screen:vads-l-col--8 vads-u-margin-bottom--2">
            <h1 className="vads-u-flex--1">{pageTitle}</h1>
            {fetchWindowsStatus === FETCH_STATUS.loading ? (
              <div className="vads-u-margin-y--8">
                <LoadingIndicator />
              </div>
            ) : (
              <>
                {showScheduleButton && (
                  <ScheduleNewAppointment
                    isCernerOnlyPatient={isCernerOnlyPatient}
                    showCommunityCare={showCommunityCare}
                    showDirectScheduling={showDirectScheduling}
                    startNewAppointmentFlow={this.startNewAppointmentFlow}
                  />
                )}
                <RequestExpressCare {...expressCare} />
              </>
            )}
            {showPastAppointments && (
              <TabNav hasExpressCare={hasExpressCareAccess} />
            )}
            {children}
            <NeedHelp />
          </div>
        </div>
        <CancelAppointmentModal
          {...cancelInfo}
          onConfirm={this.props.confirmCancelAppointment}
          onClose={this.props.closeCancelAppointment}
        />
      </div>
    );
  }
}

AppointmentsPage.propTypes = {
  cancelInfo: PropTypes.object,
  closeCancelAppointment: PropTypes.func.isRequired,
  confirmCancelAppointment: PropTypes.func.isRequired,
  isCernerOnlyPatient: PropTypes.bool.isRequired,
  isWelcomeModalDismissed: PropTypes.bool.isRequired,
  showPastAppointments: PropTypes.bool.isRequired,
  showCommunityCare: PropTypes.bool.isRequired,
  showDirectScheduling: PropTypes.bool.isRequired,
  startNewAppointmentFlow: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    cancelInfo: getCancelInfo(state),
    showPastAppointments: vaosPastAppts(state),
    showScheduleButton: vaosRequests(state),
    showCommunityCare: vaosCommunityCare(state),
    showDirectScheduling: vaosDirectScheduling(state),
    hasExpressCareAccess: vaosExpressCare(state),
    isWelcomeModalDismissed: isWelcomeModalDismissed(state),
    isCernerOnlyPatient: selectIsCernerOnlyPatient(state),
    expressCare: selectExpressCare(state),
  };
}

const mapDispatchToProps = {
  fetchExpressCareWindows,
  closeCancelAppointment,
  confirmCancelAppointment,
  startNewAppointmentFlow,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AppointmentsPage);
