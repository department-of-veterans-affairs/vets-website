import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import recordEvent from 'platform/monitoring/record-event';
import Breadcrumbs from '../components/Breadcrumbs';
import ScheduleNewAppointment from '../components/ScheduleNewAppointment';
import {
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
} from '../utils/selectors';
import { selectIsCernerOnlyPatient } from 'platform/user/selectors';
import { GA_PREFIX } from '../utils/constants';
import { scrollAndFocus } from '../utils/scrollAndFocus';
import NeedHelp from '../components/NeedHelp';
import TabNav from '../components/TabNav';
import TabNavNoExpress from '../components/TabNavNoExpress';

const pageTitle = 'VA appointments';

export class AppointmentsPage extends Component {
  componentDidMount() {
    if (this.props.isWelcomeModalDismissed) {
      scrollAndFocus();
    }

    document.title = `${pageTitle} | Veterans Affairs`;
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
      showDirectScheduling,
      showExpressCare,
      isCernerOnlyPatient,
      showPastAppointments,
    } = this.props;

    return (
      <div className="vads-l-grid-container vads-u-padding-x--2p5 large-screen:vads-u-padding-x--0 vads-u-padding-bottom--2p5">
        <Breadcrumbs />
        <div className="vads-l-row">
          <div className="vads-l-col--12 medium-screen:vads-l-col--8 vads-u-margin-bottom--2">
            <h1 className="vads-u-flex--1">{pageTitle}</h1>
            {showScheduleButton && (
              <ScheduleNewAppointment
                isCernerOnlyPatient={isCernerOnlyPatient}
                showCommunityCare={showCommunityCare}
                showDirectScheduling={showDirectScheduling}
                startNewAppointmentFlow={this.startNewAppointmentFlow}
              />
            )}
            {showPastAppointments && !showExpressCare && <TabNavNoExpress />}
            {showPastAppointments && showExpressCare && <TabNav />}
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
    showExpressCare: vaosExpressCare(state),
    isWelcomeModalDismissed: isWelcomeModalDismissed(state),
    isCernerOnlyPatient: selectIsCernerOnlyPatient(state),
  };
}

const mapDispatchToProps = {
  closeCancelAppointment,
  confirmCancelAppointment,
  startNewAppointmentFlow,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AppointmentsPage);
