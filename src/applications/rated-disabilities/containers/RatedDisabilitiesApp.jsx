import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import DowntimeNotification, {
  externalServices,
} from '@department-of-veterans-affairs/platform-monitoring/DowntimeNotification';
import { RequiredLoginView } from '@department-of-veterans-affairs/platform-user/RequiredLoginView';
import backendServices from '@department-of-veterans-affairs/platform-user/profile/backendServices';

import { fetchRatedDisabilities, fetchTotalDisabilityRating } from '../actions';
import AppContent from '../components/AppContent';
import RatedDisabilityView from '../components/RatedDisabilityView';
import {
  isLoadingFeatures,
  rdDetectDiscrepancies,
  rdSortAbTest,
} from '../selectors';

const RatedDisabilitiesApp = props => {
  const { featureFlagsLoading, ratedDisabilities } = props.ratedDisabilities;

  return (
    <div className="vads-u-margin-y--5">
      <RequiredLoginView
        serviceRequired={backendServices.USER_PROFILE}
        user={props.user}
      >
        <DowntimeNotification
          appTitle="Rated Disabilities"
          dependencies={[
            externalServices.evss,
            externalServices.global,
            externalServices.mvi,
            externalServices.vaProfile,
            externalServices.vbms,
          ]}
        >
          <AppContent featureFlagsLoading={featureFlagsLoading}>
            <RatedDisabilityView
              detectDiscrepancies={props.detectDiscrepancies}
              error={props.error}
              fetchRatedDisabilities={props.fetchRatedDisabilities}
              fetchTotalDisabilityRating={props.fetchTotalDisabilityRating}
              loading={props.loading}
              ratedDisabilities={ratedDisabilities}
              sortToggle={props.sortToggle}
              totalDisabilityRating={props.totalDisabilityRating}
              user={props.user}
            />
          </AppContent>
        </DowntimeNotification>
      </RequiredLoginView>
    </div>
  );
};

RatedDisabilitiesApp.propTypes = {
  detectDiscrepancies: PropTypes.bool,
  error: PropTypes.string,
  fetchRatedDisabilities: PropTypes.func,
  fetchTotalDisabilityRating: PropTypes.func,
  loading: PropTypes.bool,
  ratedDisabilities: PropTypes.object,
  sortToggle: PropTypes.bool,
  totalDisabilityRating: PropTypes.number,
  user: PropTypes.object,
};

const mapStateToProps = state => ({
  detectDiscrepancies: rdDetectDiscrepancies(state),
  error: state.totalRating.error,
  featureFlagsLoading: isLoadingFeatures(state),
  loading: state.totalRating.loading,
  ratedDisabilities: state.ratedDisabilities,
  sortToggle: rdSortAbTest(state),
  totalDisabilityRating: state.totalRating.totalDisabilityRating,
  user: state.user,
});

const mapDispatchToProps = {
  fetchRatedDisabilities,
  fetchTotalDisabilityRating,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RatedDisabilitiesApp);
export { RatedDisabilitiesApp };
