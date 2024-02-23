import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import DowntimeNotification, {
  externalServices,
} from '@department-of-veterans-affairs/platform-monitoring/DowntimeNotification';
import { RequiredLoginView } from '@department-of-veterans-affairs/platform-user/RequiredLoginView';
import backendServices from '@department-of-veterans-affairs/platform-user/profile/backendServices';

import { fetchRatedDisabilities, fetchTotalDisabilityRating } from '../actions';
import FeatureFlagsLoaded from '../components/FeatureFlagsLoaded';
import MVIError from '../components/MVIError';
import RatedDisabilityView from '../components/RatedDisabilityView';
import {
  isLoadingFeatures,
  rdDetectDiscrepancies,
  rdSortAbTest,
} from '../selectors';

const App = props => {
  const { featureFlagsLoading, user } = props;
  const { ratedDisabilities } = props.ratedDisabilities;

  return (
    <RequiredLoginView
      serviceRequired={backendServices.USER_PROFILE}
      user={user}
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
        <MVIError />

        {!user.profile.verified || user.profile.status !== 'OK' ? (
          <MVIError />
        ) : (
          <FeatureFlagsLoaded featureFlagsLoading={featureFlagsLoading}>
            <RatedDisabilityView
              detectDiscrepancies={props.detectDiscrepancies}
              error={props.error}
              fetchRatedDisabilities={props.fetchRatedDisabilities}
              fetchTotalDisabilityRating={props.fetchTotalDisabilityRating}
              loading={props.loading}
              ratedDisabilities={ratedDisabilities}
              sortToggle={props.sortToggle}
              totalDisabilityRating={props.totalDisabilityRating}
              user={user}
            />
          </FeatureFlagsLoaded>
        )}
      </DowntimeNotification>
    </RequiredLoginView>
  );
};

App.propTypes = {
  detectDiscrepancies: PropTypes.bool,
  error: PropTypes.string,
  featureFlagsLoading: PropTypes.bool,
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
)(App);
export { App };
