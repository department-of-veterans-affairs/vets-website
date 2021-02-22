import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import * as actions from './redux/actions';
import { FETCH_STATUS } from '../utils/constants';
import { scrollAndFocus } from '../utils/scrollAndFocus';
import { getCancelInfo } from './redux/selectors';
import { selectFeatureHomepageRefresh } from '../redux/selectors';
import PageLayout from './components/AppointmentsPage/PageLayout';
import AppointmentsPageV2 from './components/AppointmentsPage/AppointmentsPageV2';
import AppointmentsPage from './components/AppointmentsPage/index';
import RequestedAppointmentDetailsPage from './components/RequestedAppointmentDetailsPage';
import ConfirmedAppointmentDetailsPage from './components/ConfirmedAppointmentDetailsPage/ConfirmedAppointmentDetailsPage';
import CommunityCareAppointmentDetailsPage from './components/CommunityCareAppointmentDetailsPage';
import CancelAppointmentModal from './components/cancel/CancelAppointmentModal';

function AppointmentListSection({
  cancelInfo,
  closeCancelAppointment,
  confirmCancelAppointment,
  featureHomepageRefresh,
}) {
  useEffect(
    () => {
      if (
        !cancelInfo.showCancelModal &&
        cancelInfo.cancelAppointmentStatus === FETCH_STATUS.succeeded
      ) {
        scrollAndFocus();
      }
    },
    [cancelInfo.showCancelModal, cancelInfo.cancelAppointmentStatus],
  );

  return (
    <>
      <Switch>
        {featureHomepageRefresh && (
          <Route
            path="/cc/:id"
            component={() => (
              <PageLayout>
                <CommunityCareAppointmentDetailsPage />
              </PageLayout>
            )}
          />
        )}
        {featureHomepageRefresh && (
          <Route
            path="/va/:id"
            component={() => (
              <PageLayout>
                <ConfirmedAppointmentDetailsPage />
              </PageLayout>
            )}
          />
        )}
        {featureHomepageRefresh && (
          <Route
            path="/requests/:id"
            component={() => (
              <PageLayout>
                <RequestedAppointmentDetailsPage />
              </PageLayout>
            )}
          />
        )}
        <Route
          path="/"
          render={() => {
            let content = <AppointmentsPage />;
            if (featureHomepageRefresh) {
              content = <AppointmentsPageV2 />;
            }

            return (
              <PageLayout showBreadcrumbs showNeedHelp>
                {content}
              </PageLayout>
            );
          }}
        />
      </Switch>
      <CancelAppointmentModal
        {...cancelInfo}
        onConfirm={confirmCancelAppointment}
        onClose={closeCancelAppointment}
      />
    </>
  );
}

function mapStateToProps(state) {
  return {
    featureHomepageRefresh: selectFeatureHomepageRefresh(state),
    cancelInfo: getCancelInfo(state),
  };
}

const mapDispatchToProps = {
  closeCancelAppointment: actions.closeCancelAppointment,
  confirmCancelAppointment: actions.confirmCancelAppointment,
};

export const AppointmentList = connect(
  mapStateToProps,
  mapDispatchToProps,
)(AppointmentListSection);
