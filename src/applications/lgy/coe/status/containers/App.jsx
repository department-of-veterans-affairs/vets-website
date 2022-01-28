import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import RequiredLoginView from 'platform/user/authorization/components/RequiredLoginView';
import { isLoggedIn } from 'platform/user/selectors';
import backendServices from 'platform/user/profile/constants/backendServices';

import { generateCoe } from '../../shared/actions';
import {
  CALLSTATUS,
  COE_FORM_NUMBER,
  COE_ELIGIBILITY_STATUS,
} from '../../shared/constants';
import {
  Available,
  Denied,
  Eligible,
  Ineligible,
  Pending,
} from '../components/statuses';

const App = props => {
  const {
    downloadUrl,
    loggedIn,
    certificateOfEligibility: { generateAutoCoeStatus, profileIsUpdating, coe },
    hasSavedForm,
    getCoeStatus,
  } = props;

  const clickHandler = () => {
    getCoeStatus('skip');
  };

  useEffect(
    () => {
      if (!profileIsUpdating && loggedIn && !hasSavedForm && !coe) {
        getCoeStatus();
      }
    },
    [loggedIn, profileIsUpdating, hasSavedForm, coe, getCoeStatus],
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
          <Eligible clickHandler={clickHandler} downloadUrl={downloadUrl} />
        );
        break;
      case COE_ELIGIBILITY_STATUS.ineligible:
        content = <Ineligible />;
        break;
      case COE_ELIGIBILITY_STATUS.denied:
        content = <Denied />;
        break;
      case COE_ELIGIBILITY_STATUS.pending:
        content = (
          <Pending
            notOnUploadPage
            applicationCreateDate={coe.applicationCreateDate}
            status={coe.status}
          />
        );
        break;
      case COE_ELIGIBILITY_STATUS.pendingUpload:
        content = (
          <Pending
            uploadsNeeded
            applicationCreateDate={coe.applicationCreateDate}
            status={coe.status}
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
  downloadUrl: state.certificateOfEligibility.downloadUrl,
  user: state.user,
  loggedIn: isLoggedIn(state),
  certificateOfEligibility: state.certificateOfEligibility,
  hasSavedForm: state?.user?.profile?.savedForms.some(
    form => form.form === COE_FORM_NUMBER,
  ),
});

const mapDispatchToProps = {
  getCoeStatus: generateCoe,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
