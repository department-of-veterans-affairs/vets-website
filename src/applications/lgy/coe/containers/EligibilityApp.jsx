import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import { isLoggedIn } from 'platform/user/selectors';
import backendServices from 'platform/user/profile/constants/backendServices';
import RequiredLoginView from 'platform/user/authorization/components/RequiredLoginView';
import { generateCoe } from '../actions';
import { CoeAvailable } from '../components/CoeAvailable';
import { CoeDenied } from '../components/CoeDenied';
import { CoeEligible } from '../components/CoeEligible';
import { CoeIneligible } from '../components/CoeIneligible';
import { CoePending } from '../components/CoePending';
import {
  CALLSTATUS,
  COE_FORM_NUMBER,
  COE_ELIGIBILITY_STATUS,
} from '../constants';

const EligibilityApp = props => {
  const {
    loggedIn,
    certificateOfEligibility: { generateAutoCoeStatus, profileIsUpdating, coe },
    hasSavedForm,
  } = props;

  const clickHandler = () => {
    props.generateCoe('skip');
  };

  useEffect(
    () => {
      if (!profileIsUpdating && loggedIn && !hasSavedForm && !coe) {
        props.generateCoe();
      }
    },
    [loggedIn],
  );

  let content;

  if (generateAutoCoeStatus === CALLSTATUS.idle || profileIsUpdating) {
    content = <va-loading-indictator message="Loading application..." />;
  } else if (generateAutoCoeStatus === CALLSTATUS.pending) {
    content = (
      <va-loading-indictator message="Checking automatic COE eligibility..." />
    );
  } else if (
    generateAutoCoeStatus === CALLSTATUS.success ||
    (generateAutoCoeStatus === CALLSTATUS.skip && coe)
  ) {
    switch (coe.status) {
      case COE_ELIGIBILITY_STATUS.available:
        content = <CoeAvailable />;
        break;
      case COE_ELIGIBILITY_STATUS.eligible:
        content = <CoeEligible clickHandler={clickHandler} />;
        break;
      case COE_ELIGIBILITY_STATUS.ineligible:
        content = <CoeIneligible />;
        break;
      case COE_ELIGIBILITY_STATUS.denied:
        content = <CoeDenied />;
        break;
      case COE_ELIGIBILITY_STATUS.pending:
        content = <CoePending notOnUploadPage />;
        break;
      case COE_ELIGIBILITY_STATUS.pendingUpload:
        content = <CoePending uploadsNeeded />;
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
        user={props.user}
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
  user: state.user,
  loggedIn: isLoggedIn(state),
  certificateOfEligibility: state.certificateOfEligibility,
  hasSavedForm: state?.user?.profile?.savedForms.some(
    form => form.form === COE_FORM_NUMBER,
  ),
});

const mapDispatchToProps = {
  generateCoe,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EligibilityApp);

export { EligibilityApp };
