import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import TernaryRadios from '../TernaryRadios';
import { updateBurnPit211 } from '../../../actions';
import {
  QUESTION_MAP,
  RESPONSES,
  SHORT_NAME_MAP,
} from '../../../utilities/question-data-map';
import { ROUTES } from '../../../constants';
import {
  displayConditionsMet,
  navigateBackward,
  navigateForward,
} from '../../../utilities/display-logic';
import { pageSetup } from '../../../utilities/page-setup';

const BurnPit211 = ({
  formResponses,
  router,
  setBurnPit211,
  viewedIntroPage,
}) => {
  const [formError, setFormError] = useState(false);
  const shortName = SHORT_NAME_MAP.BURN_PIT_2_1_1;
  const H1 = QUESTION_MAP[shortName];
  const burnPit211 = formResponses[shortName];
  const { NO, NOT_SURE, YES } = RESPONSES;

  useEffect(
    () => {
      pageSetup(H1);
    },
    [H1],
  );

  useEffect(
    () => {
      if (!viewedIntroPage || !displayConditionsMet(shortName, formResponses)) {
        router.push(ROUTES.HOME);
      }
    },
    [formResponses, router, shortName, viewedIntroPage],
  );

  const onContinueClick = () => {
    if (!burnPit211) {
      setFormError(true);
    } else {
      setFormError(false);
      navigateForward(shortName, formResponses, router);
    }
  };

  const onBackClick = () => {
    navigateBackward(shortName, formResponses, router);
  };

  const onValueChange = event => {
    const { value } = event?.detail;
    setBurnPit211(value);

    if (value) {
      setFormError(false);
    }
  };

  const onBlurInput = () => {
    if (burnPit211) {
      setFormError(false);
    }
  };

  const locationList = (
    <ul>
      <li>Arabian Sea</li>
      <li>Gulf of Aden</li>
      <li>Gulf of Oman</li>
      <li>Neutral zone between Iraq/Saudi Arabia</li>
      <li>Persian Gulf</li>
      <li>Red Sea</li>
    </ul>
  );

  return (
    <>
      <h1>{H1}</h1>
      <TernaryRadios
        formError={formError}
        formValue={burnPit211}
        h1={H1}
        locationList={locationList}
        onBackClick={onBackClick}
        onBlurInput={onBlurInput}
        onContinueClick={onContinueClick}
        onValueChange={onValueChange}
        responses={[YES, NO, NOT_SURE]}
        shortName={shortName}
        testId="paw-burnPit2_1_1"
      />
    </>
  );
};

const mapStateToProps = state => ({
  formResponses: state?.pactAct?.form,
  viewedIntroPage: state?.pactAct?.viewedIntroPage,
});

const mapDispatchToProps = {
  setBurnPit211: updateBurnPit211,
};

BurnPit211.propTypes = {
  formResponses: PropTypes.object.isRequired,
  setBurnPit211: PropTypes.func.isRequired,
  viewedIntroPage: PropTypes.bool.isRequired,
  router: PropTypes.shape({
    push: PropTypes.func,
  }),
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BurnPit211);
