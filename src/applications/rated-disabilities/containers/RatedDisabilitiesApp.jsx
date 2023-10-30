import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import DowntimeNotification, {
  externalServices,
} from '@department-of-veterans-affairs/platform-monitoring/DowntimeNotification';
import { toggleValues } from '@department-of-veterans-affairs/platform-site-wide/selectors';
import { RequiredLoginView } from '@department-of-veterans-affairs/platform-user/RequiredLoginView';
import backendServices from '@department-of-veterans-affairs/platform-user/profile/backendServices';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';

import { fetchRatedDisabilities, fetchTotalDisabilityRating } from '../actions';
import RatedDisabilityView from '../components/RatedDisabilityView';
import { rdDetectDiscrepancies } from '../selectors';

const RatedDisabilitiesApp = props => {
  const { ratedDisabilities } = props.ratedDisabilities;

  return (
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
      </DowntimeNotification>
    </RequiredLoginView>
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
  loading: state.totalRating.loading,
  ratedDisabilities: state.ratedDisabilities,
  sortToggle: toggleValues(state)[
    FEATURE_FLAG_NAMES.ratedDisabilitiesSortAbTest
  ],
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
