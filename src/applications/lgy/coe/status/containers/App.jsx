import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import environment from 'platform/utilities/environment';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import RequiredLoginView from 'platform/user/authorization/components/RequiredLoginView';
import backendServices from 'platform/user/profile/constants/backendServices';
import { isLoggedIn } from 'platform/user/selectors';
import { RenderError } from '../../shared/components/errors/RenderError';

import { generateCoe } from '../../shared/actions';
import { CALLSTATUS, COE_ELIGIBILITY_STATUS } from '../../shared/constants';
import { Available, Denied, Eligible, Pending } from '../components/statuses';
import { isLoadingFeatures, showCoeFeature } from '../../shared/utils/helpers';
import { WIP } from '../../shared/components/WIP';

const App = ({
  certificateOfEligibility: {
    coe,
    errors,
    generateAutoCoeStatus,
    profileIsUpdating,
  },
  getCoe,
  getCoeMock,
  loggedIn,
  user,
  showCoe,
  isLoading,
}) => {
  useEffect(
    () => {
      if (
        // Show WIP alert if the feature flag isn't set - remove once @ 100%
        !isLoading &&
        showCoe &&
        // get COE status
        !profileIsUpdating &&
        !coe
      ) {
        if (typeof getCoeMock === 'function' && !environment.isProduction()) {
          getCoeMock(!loggedIn);
        } else {
          getCoe(!loggedIn);
        }
      }
    },
    [coe, getCoe, getCoeMock, isLoading, loggedIn, profileIsUpdating, showCoe],
  );

  // Show WIP alert if the feature flag isn't set - remove once @ 100%
  if (!showCoe && !isLoading) {
    return <WIP />;
  }

  let content;

  if (
    generateAutoCoeStatus === CALLSTATUS.idle ||
    profileIsUpdating ||
    isLoading
  ) {
    content = <va-loading-indicator message="Loading application..." />;
  } else if (generateAutoCoeStatus === CALLSTATUS.pending) {
    content = (
      <va-loading-indicator message="Checking automatic COE eligibility..." />
    );
  } else if (
    generateAutoCoeStatus === CALLSTATUS.success ||
    (generateAutoCoeStatus === CALLSTATUS.skip && coe)
  ) {
    switch (coe) {
      case COE_ELIGIBILITY_STATUS.available:
        content = <Available />;
        break;
      case COE_ELIGIBILITY_STATUS.eligible:
        content = (
          <Eligible
            clickHandler={() => {}}
            referenceNumber={coe.referenceNumber}
          />
        );
        break;
      case COE_ELIGIBILITY_STATUS.denied:
        content = <Denied referenceNumber={coe.referenceNumber} />;
        break;
      case COE_ELIGIBILITY_STATUS.pending:
        content = (
          <Pending
            notOnUploadPage
            referenceNumber={coe.referenceNumber}
            requestDate={coe.applicationCreateDate}
            status={coe.status}
          />
        );
        break;
      case COE_ELIGIBILITY_STATUS.pendingUpload:
        content = (
          <Pending
            referenceNumber={coe.referenceNumber}
            requestDate={coe.applicationCreateDate}
            status={coe.status}
            uploadsNeeded
          />
        );
        break;
      default:
        content = <RenderError error={coe.status} />;
    }
  } else {
    content = <RenderError error={errors.coe[0].code} />;
  }

  return (
    <>
      <RequiredLoginView
        serviceRequired={backendServices.USER_PROFILE}
        user={user}
      >
        <header className="row vads-u-padding-x--1">
          <FormTitle title="Your VA home loan COE" />
        </header>
        {content}
      </RequiredLoginView>
    </>
  );
};

const mapStateToProps = state => ({
  certificateOfEligibility: state.certificateOfEligibility,
  user: state.user,
  loggedIn: isLoggedIn(state),
  isLoading: isLoadingFeatures(state),
  showCoe: showCoeFeature(state),
});

const mapDispatchToProps = {
  getCoe: generateCoe,
};

App.propTypes = {
  certificateOfEligibility: PropTypes.object,
  getCoe: PropTypes.func,
  getCoeMock: PropTypes.func,
  isLoading: PropTypes.bool,
  loggedIn: PropTypes.bool,
  showCoe: PropTypes.bool,
  user: PropTypes.object,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);

export { App };
