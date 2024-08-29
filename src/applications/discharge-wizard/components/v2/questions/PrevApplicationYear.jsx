import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  QUESTION_MAP,
  RESPONSES,
  SHORT_NAME_MAP,
} from '../../../constants/question-data-map';
import RadioGroup from './shared/RadioGroup';
import { updatePrevApplicationYear } from '../../../actions';
import { pageSetup } from '../../../utilities/page-setup';
import { ROUTES } from '../../../constants';

const PrevApplicationYear = ({
  formResponses,
  setPrevApplicationYear,
  router,
  viewedIntroPage,
}) => {
  const [formError, setFormError] = useState(false);
  const shortName = SHORT_NAME_MAP.PREV_APPLICATION_YEAR;
  const H1 = QUESTION_MAP[shortName];
  const prevApplicationYear = formResponses[shortName];
  const {
    PREV_APPLICATION_BEFORE_2014,
    PREV_APPLICATION_BEFORE_2011,
    PREV_APPLICATION_AFTER_2014,
    PREV_APPLICATION_AFTER_2011,
    PREV_APPLICATION_BEFORE_2017,
    PREV_APPLICATION_AFTER_2017,
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

  const prevApplicationOptions = () => {
    if (
      [RESPONSES.REASON_PTSD, RESPONSES.REASON_TBI].includes(
        formResponses.REASON,
      )
    ) {
      return [PREV_APPLICATION_BEFORE_2014, PREV_APPLICATION_AFTER_2014];
    }
    if (formResponses.REASON === RESPONSES.REASON_SEXUAL_ORIENTATION) {
      return [PREV_APPLICATION_BEFORE_2011, PREV_APPLICATION_AFTER_2011];
    }
    if (formResponses.REASON === RESPONSES.REASON_SEXUAL_ASSAULT) {
      return [PREV_APPLICATION_BEFORE_2017, PREV_APPLICATION_AFTER_2017];
    }
    return [];
  };
  return (
    <RadioGroup
      formError={formError}
      formResponses={formResponses}
      formValue={prevApplicationYear}
      H1={H1}
      responses={prevApplicationOptions()}
      router={router}
      setFormError={setFormError}
      shortName={shortName}
      testId="duw-prev_application_year"
      valueSetter={setPrevApplicationYear}
    />
  );
};

PrevApplicationYear.propTypes = {
  formResponses: PropTypes.object,
  router: PropTypes.shape({
    push: PropTypes.func,
  }),
  setPrevApplicationYear: PropTypes.func,
  viewedIntroPage: PropTypes.bool,
};

const mapStateToProps = state => ({
  formResponses: state?.dischargeUpgradeWizard?.duwForm?.form,
  viewedIntroPage: state?.dischargeUpgradeWizard?.duwForm?.viewedIntroPage,
});

const mapDispatchToProps = {
  setPrevApplicationYear: updatePrevApplicationYear,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PrevApplicationYear);
