import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  QUESTION_MAP,
  SHORT_NAME_MAP,
} from '../../constants/question-data-map';
import { updateDischargeYear } from '../../actions';
import { pageSetup } from '../../utilities/page-setup';
import { ROUTES } from '../../constants';

import YearInput from './shared/YearInput';

const DischargeYear = ({
  formResponses,
  router,
  viewedIntroPage,
  setDischargeYear,
}) => {
  const [formError, setFormError] = useState(false);
  const shortName = SHORT_NAME_MAP.DISCHARGE_YEAR;
  const H1 = QUESTION_MAP[shortName];

  useEffect(() => {
    pageSetup(H1);
  }, [H1]);

  useEffect(() => {
    if (!viewedIntroPage) {
      router.push(ROUTES.HOME);
    }
  }, [router, viewedIntroPage]);

  const dischargeYear = formResponses[shortName];

  return (
    <YearInput
      H1={H1}
      formError={formError}
      formResponses={formResponses}
      formValue={dischargeYear}
      router={router}
      setFormError={setFormError}
      shortName={shortName}
      testId="duw-discharge_year"
      valueSetter={setDischargeYear}
    />
  );
};

DischargeYear.propTypes = {
  formResponses: PropTypes.object.isRequired,
  setDischargeYear: PropTypes.func.isRequired,
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
  setDischargeYear: updateDischargeYear,
};

export default connect(mapStateToProps, mapDispatchToProps)(DischargeYear);
