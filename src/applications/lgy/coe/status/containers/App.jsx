import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import { RequiredLoginView } from 'platform/user/authorization/components/RequiredLoginView';
import backendServices from 'platform/user/profile/constants/backendServices';
import {
  DowntimeNotification,
  externalServices,
} from 'platform/monitoring/DowntimeNotification';
import { isLoggedIn, selectProfile } from 'platform/user/selectors';
import environment from 'platform/utilities/environment';

import MissingEDIPI from '../../form/components/MissingEDIPI';
import NeedsToVerify from '../../form/components/NeedsToVerify';
import { generateCoe } from '../../shared/actions';
import { WIP } from '../../shared/components/WIP';
import { CALLSTATUS, COE_ELIGIBILITY_STATUS } from '../../shared/constants';
import { isLoadingFeatures, showCoeFeature } from '../../shared/utils/helpers';
import {
  Available,
  Denied,
  Eligible,
  Ineligible,
  Pending,
} from '../components/statuses';

const App = ({
  canApply,
  certificateOfEligibility: { coe, generateAutoCoeStatus, profileIsUpdating },
  getCoe,
  getCoeMock,
  isLoading,
  isVerified,
  location,
  showCoe,
  user,
}) => {
  useEffect(() => {
    if (
      // Show WIP alert if the feature flag isn't set - remove once @ 100%
      !isLoading &&
      showCoe &&
      // get COE status
      !profileIsUpdating &&
      !coe
    ) {
      if (typeof getCoeMock === 'function' && !environment.isProduction()) {
        getCoeMock(!canApply);
      } else {
        getCoe(!canApply);
      }
    }
  }, [
    coe,
    getCoe,
    getCoeMock,
    isLoading,
    canApply,
    profileIsUpdating,
    showCoe,
  ]);

  // Show WIP alert if the feature flag isn't set - remove once @ 100%
  if (!showCoe && !isLoading) {
    return <WIP />;
  }

  let content;
  const pathname = location.basename;

  if (!isVerified) {
    content = (
      <div className="row vads-u-margin-bottom--4">
        <NeedsToVerify pathname={pathname} />
      </div>
    );
  } else if (!canApply) {
    content = (
      <div className="row vads-u-margin-bottom--4">
        <MissingEDIPI />
      </div>
    );
  } else if (
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
    switch (coe.status) {
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
        content = (
          <Denied
            referenceNumber={coe.referenceNumber}
            requestDate={coe.applicationCreateDate}
          />
        );
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
        content = <Ineligible />;
    }
  } else {
    content = <Ineligible />;
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
        <div className="row">
          <DowntimeNotification
            appTitle="Certificate of Eligibility Status Tool"
            dependencies={[externalServices.coe]}
          >
            {content}
          </DowntimeNotification>
        </div>
      </RequiredLoginView>
    </>
  );
};

const mapStateToProps = state => ({
  certificateOfEligibility: state.certificateOfEligibility,
  user: state.user,
  canApply: isLoggedIn(state) && selectProfile(state).claims?.coe,
  isVerified: selectProfile(state)?.verified || false,
  isLoading: isLoadingFeatures(state),
  showCoe: showCoeFeature(state),
});

const mapDispatchToProps = {
  getCoe: generateCoe,
};

App.propTypes = {
  canApply: PropTypes.bool,
  certificateOfEligibility: PropTypes.object,
  getCoe: PropTypes.func,
  getCoeMock: PropTypes.func,
  isLoading: PropTypes.bool,
  isVerified: PropTypes.bool,
  location: PropTypes.shape({
    basename: PropTypes.string,
  }),
  showCoe: PropTypes.bool,
  user: PropTypes.object,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);

export { App };
