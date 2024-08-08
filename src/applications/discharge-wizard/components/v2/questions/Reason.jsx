import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  QUESTION_MAP,
  RESPONSES,
  SHORT_NAME_MAP,
} from '../../../constants/question-data-map';
import RadioGroup from './shared/RadioGroup';
import { updateReason } from '../../../actions';
import { pageSetup } from '../../../utilities/page-setup';
import { ROUTES } from '../../../constants';

const Reason = ({ formResponses, setReason, router, viewedIntroPage }) => {
  const [formError, setFormError] = useState(false);
  const shortName = SHORT_NAME_MAP.REASON;
  const H1 = QUESTION_MAP[shortName];
  const reason = formResponses[shortName];
  const hint =
    'Note: If more than one of these descriptions matches your situation, choose the one that started the events that led to your discharge. For example, if you sustained a traumatic brain injury, which led to posttraumatic stress disorder (PTSD), choose number 2.';
  const {
    REASON_1,
    REASON_2,
    REASON_3,
    REASON_4,
    REASON_5,
    REASON_6,
    REASON_7,
    REASON_8,
  } = RESPONSES;

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
      formValue={reason}
      hint={hint}
      H1={H1}
      responses={[
        REASON_1,
        REASON_2,
        REASON_3,
        REASON_4,
        REASON_5,
        REASON_8,
        REASON_6,
        REASON_7,
      ]}
      router={router}
      setFormError={setFormError}
      shortName={shortName}
      testId="duw-reason"
      valueSetter={setReason}
    />
  );
};

Reason.propTypes = {
  formResponses: PropTypes.object,
  router: PropTypes.shape({
    push: PropTypes.func,
  }),
  setReason: PropTypes.func,
  viewedIntroPage: PropTypes.bool,
};

const mapStateToProps = state => ({
  formResponses: state?.dischargeUpgradeWizard?.duwForm?.form,
  viewedIntroPage: state?.dischargeUpgradeWizard?.duwForm?.viewedIntroPage,
});

const mapDispatchToProps = {
  setReason: updateReason,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Reason);
