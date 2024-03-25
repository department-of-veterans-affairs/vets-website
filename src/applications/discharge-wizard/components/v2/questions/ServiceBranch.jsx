import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import Scroll from 'react-scroll';
import {
  QUESTION_MAP,
  RESPONSES,
  SHORT_NAME_MAP,
} from '../../../constants/question-data-map';
import RadioGroup from './shared/RadioGroup';
import { updateServiceBranch } from '../../../actions';
import { pageSetup } from '../../../../pact-act/utilities/page-setup';
import { ROUTES } from '../../../constants';

const ServiceBranch = ({
  formResponses,
  //   handleKeyDown,
  //   scrollToLast,
  setServiceBranch,
  router,
  viewedIntroPage,
}) => {
  const [formError, setFormError] = useState(false);

  const shortName = SHORT_NAME_MAP.SERVICE_BRANCH;
  const H1 = QUESTION_MAP[shortName];
  const serviceBranch = formResponses[shortName];
  const { ARMY, NAVY, AIR_FORCE, COAST_GUARD, MARINE_CORPS } = RESPONSES;

  useEffect(
    () => {
      pageSetup(H1);
    },
    [H1],
  );

  useEffect(
    () => {
      if (!viewedIntroPage) {
        router.push(ROUTES.HOME);
      }
    },
    [router, viewedIntroPage],
  );

  return (
    <div className="vads-u-margin-top--6">
      <RadioGroup
        formError={formError}
        formResponses={formResponses}
        formValue={serviceBranch}
        h1={H1}
        responses={[ARMY, NAVY, AIR_FORCE, COAST_GUARD, MARINE_CORPS]}
        router={router}
        setFormError={setFormError}
        shortName={shortName}
        testId="duw-service_branch"
        valueSetter={setServiceBranch}
      />
    </div>
  );
};

ServiceBranch.propTypes = {
  formValues: PropTypes.object,
  handleKeyDown: PropTypes.func,
  scrollToLast: PropTypes.func,
  updateField: PropTypes.func,
};

const mapStateToProps = state => ({
  formResponses: state?.dischargeUpgradeWizard?.duwForm?.form,
  viewedIntroPage: state?.dischargeUpgradeWizard?.duwForm?.viewedIntroPage,
});

const mapDispatchToProps = {
  setServiceBranch: updateServiceBranch,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ServiceBranch);
