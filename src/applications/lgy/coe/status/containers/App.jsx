import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import RequiredLoginView from 'platform/user/authorization/components/RequiredLoginView';
import backendServices from 'platform/user/profile/constants/backendServices';
import { isLoggedIn } from 'platform/user/selectors';

import { generateCoe } from '../../shared/actions';
import { CALLSTATUS, COE_ELIGIBILITY_STATUS } from '../../shared/constants';
import {
  Available,
  Denied,
  Eligible,
  Ineligible,
  Pending,
} from '../components/statuses';

const App = ({
  certificateOfEligibility: {
    coe,
    downloadUrl,
    generateAutoCoeStatus,
    profileIsUpdating,
  },
  getCoe,
  loggedIn,
  user,
}) => {
  const clickHandler = useCallback(
    () => {
      getCoe('skip');
    },
    [getCoe],
  );

  useEffect(
    () => {
      if (!profileIsUpdating && loggedIn && !coe) {
        getCoe();
      }
    },
    [coe, getCoe, loggedIn, profileIsUpdating],
  );

  let content;

  if (generateAutoCoeStatus === CALLSTATUS.idle || profileIsUpdating) {
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
        content = <Available downloadUrl={downloadUrl} />;
        break;
      case COE_ELIGIBILITY_STATUS.eligible:
        content = (
          <Eligible
            clickHandler={clickHandler}
            downloadUrl={downloadUrl}
            referenceNumber={coe.referenceNumber}
          />
        );
        break;
      case COE_ELIGIBILITY_STATUS.ineligible:
        content = <Ineligible />;
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
        {content}
      </RequiredLoginView>
    </>
  );
};

const mapStateToProps = state => ({
  certificateOfEligibility: state.certificateOfEligibility,
  user: state.user,
  loggedIn: isLoggedIn(state),
});

const mapDispatchToProps = {
  getCoe: generateCoe,
};

App.propTypes = {
  certificateOfEligibility: PropTypes.object,
  getCoe: PropTypes.func,
  loggedIn: PropTypes.bool,
  user: PropTypes.object,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);

export { App };
