import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  QUESTION_MAP,
  RESPONSES,
  SHORT_NAME_MAP,
} from '../../../constants/question-data-map';
import RadioGroup from './shared/RadioGroup';
import { updateFailureToExhaust } from '../../../actions';
import { pageSetup } from '../../../utilities/page-setup';
import { ROUTES } from '../../../constants';

const FailureToExhaust = ({
  formResponses,
  setFailureToExhaust,
  router,
  viewedIntroPage,
}) => {
  const [formError, setFormError] = useState(false);
  const shortName = SHORT_NAME_MAP.FAILURE_TO_EXHAUST;
  const H1 = QUESTION_MAP[shortName];
  const failureToExhaust = formResponses[shortName];
  const {
    FAILURE_TO_EXHAUST_BCMR_YES,
    FAILURE_TO_EXHAUST_BCMR_NO,
    FAILURE_TO_EXHAUST_BCNR_YES,
    FAILURE_TO_EXHAUST_BCNR_NO,
  } = RESPONSES;
  const hint =
    'Note: "Failure to exhaust other remedies" often means you applied to the wrong board.';
  let failureToExhaustOptions;

  if (
    [RESPONSES.NAVY, RESPONSES.MARINE_CORPS].includes(
      formResponses.SERVICE_BRANCH,
    )
  ) {
    failureToExhaustOptions = [
      FAILURE_TO_EXHAUST_BCNR_YES,
      FAILURE_TO_EXHAUST_BCNR_NO,
    ];
  } else {
    failureToExhaustOptions = [
      FAILURE_TO_EXHAUST_BCMR_YES,
      FAILURE_TO_EXHAUST_BCMR_NO,
    ];
  }

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
    <RadioGroup
      formError={formError}
      formResponses={formResponses}
      formValue={failureToExhaust}
      H1={H1}
      hint={hint}
      responses={failureToExhaustOptions}
      router={router}
      setFormError={setFormError}
      shortName={shortName}
      testId="duw-failure_to_exhaust"
      valueSetter={setFailureToExhaust}
    />
  );
};

FailureToExhaust.propTypes = {
  formResponses: PropTypes.object,
  router: PropTypes.shape({
    push: PropTypes.func,
  }),
  setFailureToExhaust: PropTypes.func,
  viewedIntroPage: PropTypes.bool,
};

const mapStateToProps = state => ({
  formResponses: state?.dischargeUpgradeWizard?.duwForm?.form,
  viewedIntroPage: state?.dischargeUpgradeWizard?.duwForm?.viewedIntroPage,
});

const mapDispatchToProps = {
  setFailureToExhaust: updateFailureToExhaust,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FailureToExhaust);
