import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { months } from 'platform/static-data/options-for-select';
import {
  QUESTION_MAP,
  SHORT_NAME_MAP,
} from '../../constants/question-data-map';
import { updateDischargeMonth } from '../../actions';
import { pageSetup } from '../../utilities/page-setup';
import { ROUTES } from '../../constants';

import Dropdown from './shared/Dropdown';

const DischargeMonth = ({
  formResponses,
  router,
  viewedIntroPage,
  setDischargeMonth,
}) => {
  const [formError, setFormError] = useState(false);
  const shortName = SHORT_NAME_MAP.DISCHARGE_MONTH;
  const H1 = QUESTION_MAP[shortName];

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

  const dischargeMonth = formResponses[shortName];
  const monthOptions = months.map(month => {
    return (
      <option
        data-testid="va-select-option"
        key={month.value}
        value={month.value}
      >
        {month.label}
      </option>
    );
  });

  return (
    <Dropdown
      H1={H1}
      formError={formError}
      formResponses={formResponses}
      formValue={dischargeMonth}
      router={router}
      setFormError={setFormError}
      shortName={shortName}
      testId="duw-discharge_month"
      options={monthOptions}
      valueSetter={setDischargeMonth}
    />
  );
};

DischargeMonth.propTypes = {
  formResponses: PropTypes.object.isRequired,
  setDischargeMonth: PropTypes.func.isRequired,
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
  setDischargeMonth: updateDischargeMonth,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DischargeMonth);
