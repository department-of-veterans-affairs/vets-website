import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  QUESTION_MAP,
  RESPONSES,
  SHORT_NAME_MAP,
} from '../../../constants/question-data-map';
import RadioGroup from './shared/RadioGroup';
import { updateDischargeType } from '../../../actions';
import { pageSetup } from '../../../utilities/page-setup';
import { ROUTES } from '../../../constants';

const DischargeType = ({
  formResponses,
  setDischargeType,
  router,
  viewedIntroPage,
}) => {
  const [formError, setFormError] = useState(false);
  const shortName = SHORT_NAME_MAP.DISCHARGE_TYPE;
  const H1 = QUESTION_MAP[shortName];
  const dischargeType = formResponses[shortName];
  const { DISCHARGE_HONORABLE, DISCHARGE_DISHONORABLE } = RESPONSES;

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
      formValue={dischargeType}
      H1={H1}
      responses={[DISCHARGE_HONORABLE, DISCHARGE_DISHONORABLE]}
      router={router}
      setFormError={setFormError}
      shortName={shortName}
      testId="duw-discharge_type"
      valueSetter={setDischargeType}
    />
  );
};

DischargeType.propTypes = {
  formResponses: PropTypes.object,
  setDischargeType: PropTypes.func,
  router: PropTypes.shape({
    push: PropTypes.func,
  }),
  viewedIntroPage: PropTypes.bool,
};

const mapStateToProps = state => ({
  formResponses: state?.dischargeUpgradeWizard?.duwForm?.form,
  viewedIntroPage: state?.dischargeUpgradeWizard?.duwForm?.viewedIntroPage,
});

const mapDispatchToProps = {
  setDischargeType: updateDischargeType,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DischargeType);
