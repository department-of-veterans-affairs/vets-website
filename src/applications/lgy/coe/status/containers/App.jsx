import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import { isLoggedIn } from 'platform/user/selectors';
import backendServices from 'platform/user/profile/constants/backendServices';
import RequiredLoginView from 'platform/user/authorization/components/RequiredLoginView';
import { generateCoe } from '../../shared/actions';
import { CoeAvailable } from '../components/CoeAvailable';
import { CoeDenied } from '../components/CoeDenied';
import { CoeEligible } from '../components/CoeEligible';
import { CoeIneligible } from '../components/CoeIneligible';
import { CoePending } from '../components/CoePending';
import {
  CALLSTATUS,
  COE_FORM_NUMBER,
  COE_ELIGIBILITY_STATUS,
} from '../../shared/constants';

const App = ({
  certificateOfEligibility: { generateAutoCoeStatus, profileIsUpdating, coe },
  downloadUrl,
  getCoe,
  hasSavedForm,
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
      if (!profileIsUpdating && loggedIn && !hasSavedForm && !coe) {
        getCoe();
      }
    },
    [coe, getCoe, hasSavedForm, loggedIn, profileIsUpdating],
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
        content = <CoeAvailable downloadURL={downloadUrl} />;
        break;
      case COE_ELIGIBILITY_STATUS.eligible:
        content = (
          <CoeEligible clickHandler={clickHandler} downloadURL={downloadUrl} />
        );
        break;
      case COE_ELIGIBILITY_STATUS.ineligible:
        content = <CoeIneligible />;
        break;
      case COE_ELIGIBILITY_STATUS.denied:
        content = <CoeDenied />;
        break;
      case COE_ELIGIBILITY_STATUS.pending:
        content = (
          <CoePending
            applicationCreateDate={coe.applicationCreateDate}
            notOnUploadPage
            status={coe.status}
          />
        );
        break;
      case COE_ELIGIBILITY_STATUS.pendingUpload:
        content = (
          <CoePending
            applicationCreateDate={coe.applicationCreateDate}
            uploadsNeeded
            status={coe.status}
          />
        );
        break;
      default:
        content = <CoeIneligible />;
    }
  } else {
    content = <CoeIneligible />;
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
  downloadUrl: state.certificateOfEligibility.downloadUrl,
  user: state.user,
  loggedIn: isLoggedIn(state),
  certificateOfEligibility: state.certificateOfEligibility,
  hasSavedForm: state?.user?.profile?.savedForms.some(
    form => form.form === COE_FORM_NUMBER,
  ),
});

const mapDispatchToProps = {
  getCoe: generateCoe,
};

App.propTypes = {
  certificateOfEligibility: PropTypes.object,
  downloadUrl: PropTypes.string,
  getCoe: PropTypes.func,
  hasSavedForm: PropTypes.bool,
  loggedIn: PropTypes.bool,
  user: PropTypes.object,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);

export { App };
