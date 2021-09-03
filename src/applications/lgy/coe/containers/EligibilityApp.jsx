import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import { isLoggedIn } from 'platform/user/selectors';

import { generateCoe } from '../actions';
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
    content = <LoadingIndicator message="Loading application..." />;
  } else if (generateAutoCoeStatus === CALLSTATUS.pending) {
    content = (
      <LoadingIndicator message="Checking automatic COE eligibility..." />
    );
  } else if (
    generateAutoCoeStatus === CALLSTATUS.success ||
    (generateAutoCoeStatus === CALLSTATUS.skip && coe)
  ) {
    switch (coe.status) {
      case COE_ELIGIBILITY_STATUS.eligible:
        content = <CoeEligible clickHandler={clickHandler} />;
        break;
      case COE_ELIGIBILITY_STATUS.ineligible:
        content = <CoeIneligible />;
        break;
      case COE_ELIGIBILITY_STATUS.pending:
        content = <CoePending />;
        break;
      default:
        content = <LoadingIndicator message="Loading..." />;
    }
  } else {
    content = <p>failed</p>;
  }

  return (
    <>
      <header className="row vads-u-padding-x--1">
        <FormTitle title="Apply for a VA home loan Certificate of Eligibility" />
        <p>Request for a Certificate of Eligibility (VA Form 26-1880)</p>
      </header>
      {content}
    </>
  );
};

const mapStateToProps = state => ({
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
