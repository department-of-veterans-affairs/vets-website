import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  QUESTION_MAP,
  RESPONSES,
  SHORT_NAME_MAP,
} from '../../constants/question-data-map';
import RadioGroup from './shared/RadioGroup';
import { updateServiceBranch } from '../../actions';
import { pageSetup } from '../../utilities/page-setup';
import { ROUTES } from '../../constants';

const ServiceBranch = ({
  formResponses,
  setServiceBranch,
  router,
  viewedIntroPage,
}) => {
  const [formError, setFormError] = useState(false);
  const shortName = SHORT_NAME_MAP.SERVICE_BRANCH;
  const H1 = QUESTION_MAP[shortName];
  const serviceBranch = formResponses[shortName];
  const { ARMY, NAVY, AIR_FORCE, COAST_GUARD, MARINE_CORPS } = RESPONSES;

  useEffect(() => {
    pageSetup(H1);
  }, [H1]);

  useEffect(() => {
    if (!viewedIntroPage) {
      router.push(ROUTES.HOME);
    }
  }, [router, viewedIntroPage]);

  return (
    <RadioGroup
      formError={formError}
      formResponses={formResponses}
      formValue={serviceBranch}
      H1={H1}
      responses={[ARMY, NAVY, AIR_FORCE, COAST_GUARD, MARINE_CORPS]}
      router={router}
      setFormError={setFormError}
      shortName={shortName}
      testId="duw-service_branch"
      valueSetter={setServiceBranch}
    />
  );
};

ServiceBranch.propTypes = {
  formResponses: PropTypes.object.isRequired,
  setServiceBranch: PropTypes.func.isRequired,
  viewedIntroPage: PropTypes.bool.isRequired,
  router: PropTypes.shape({
    push: PropTypes.func,
  }),
};

const mapStateToProps = state => ({
  formResponses: state?.dischargeUpgradeWizard?.duwForm?.form,
  viewedIntroPage: state?.dischargeUpgradeWizard?.duwForm?.viewedIntroPage,
});

const mapDispatchToProps = {
  setServiceBranch: updateServiceBranch,
};

export default connect(mapStateToProps, mapDispatchToProps)(ServiceBranch);
