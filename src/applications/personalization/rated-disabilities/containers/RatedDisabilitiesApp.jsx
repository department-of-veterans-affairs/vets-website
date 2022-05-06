import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import DowntimeNotification, {
  externalServices,
} from 'platform/monitoring/DowntimeNotification';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import RequiredLoginView from 'platform/user/authorization/components/RequiredLoginView';
import backendServices from 'platform/user/profile/constants/backendServices';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';

import { fetchRatedDisabilities, fetchTotalDisabilityRating } from '../actions';
import RatedDisabilityView from '../components/RatedDisabilityView';

const RatedDisabilitiesApp = props => {
  const { ratedDisabilities } = props.ratedDisabilities;

  return (
    <>
      <div className="medium-screen:vads-u-padding-left--1p5 large-screen:vads-u-padding-left--6">
        <va-breadcrumbs>
          {[
            <a href="/" aria-label="back to VA Home page" key="1">
              Home
            </a>,
            <a
              href="/disability"
              aria-label="Back to the Disability Benefits page"
              key="2"
            >
              Disability Benefits
            </a>,
            <a
              href="/disability/view-disability-rating"
              aria-label="back to the view your VA disability rating page"
              key="3"
            >
              View your VA disability rating
            </a>,
            <a href="/disability/view-disability-rating/rating" key="4">
              Your VA disability rating
            </a>,
          ]}
        </va-breadcrumbs>
      </div>
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
    </>
  );
};

RatedDisabilitiesApp.propTypes = {
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
