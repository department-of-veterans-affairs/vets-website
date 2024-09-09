import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { range } from 'lodash';

import {
  QUESTION_MAP,
  SHORT_NAME_MAP,
} from '../../../constants/question-data-map';
import { updateDischargeYear } from '../../../actions';
import { pageSetup } from '../../../utilities/page-setup';
import { ROUTES } from '../../../constants';

import Dropdown from './shared/Dropdown';

const DischargeYear = ({
  formResponses,
  router,
  viewedIntroPage,
  setDischargeYear,
}) => {
  const [formError, setFormError] = useState(false);
  const shortName = SHORT_NAME_MAP.DISCHARGE_YEAR;
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

  const dischargeYear = formResponses[shortName];
  const currentYear = new Date().getFullYear();
  const yearOptions = range(currentYear - 1992).map(i => {
    const year = currentYear - i;
    return (
      <option data-testid="va-select-option" key={i} value={year.toString()}>
        {year.toString()}
      </option>
    );
  });
  const before1992Key = yearOptions.length + 1;

  yearOptions.push(
    <option
      data-testid="va-select-option"
      key={before1992Key}
      value="Before 1992"
    >
      Before 1992
    </option>,
  );

  return (
    <Dropdown
      H1={H1}
      formError={formError}
      formResponses={formResponses}
      formValue={dischargeYear}
      router={router}
      setFormError={setFormError}
      shortName={shortName}
      testId="duw-discharge_year"
      options={yearOptions}
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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DischargeYear);
