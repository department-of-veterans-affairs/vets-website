import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import TernaryRadios from '../TernaryRadios';
import { updateBurnPit21 } from '../../../actions';
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

const BurnPit21 = ({
  formResponses,
  router,
  setBurnPit21,
  viewedIntroPage,
}) => {
  const [formError, setFormError] = useState(false);
  const shortName = SHORT_NAME_MAP.BURN_PIT_2_1;
  const H1 = QUESTION_MAP[shortName];
  const burnPit21 = formResponses[shortName];
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
    if (!burnPit21) {
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
    setBurnPit21(value);

    if (value) {
      setFormError(false);
    }
  };

  const onBlurInput = () => {
    if (burnPit21) {
      setFormError(false);
    }
  };

  const locationList = (
    <ul>
      <li>Bahrain</li>
      <li>Iraq</li>
      <li>Kuwait</li>
      <li>Oman</li>
      <li>Qatar</li>
      <li>Saudi Arabia</li>
      <li>Somalia</li>
      <li>The United Arab Emirates (UAE)</li>
      <li>The airspace above any of these locations</li>
    </ul>
  );

  return (
    <>
      <h1>{H1}</h1>
      <TernaryRadios
        formError={formError}
        formValue={burnPit21}
        h1={H1}
        locationList={locationList}
        onBackClick={onBackClick}
        onBlurInput={onBlurInput}
        onContinueClick={onContinueClick}
        onValueChange={onValueChange}
        responses={[YES, NO, NOT_SURE]}
        shortName={shortName}
        testId="paw-burnPit2_1"
      />
    </>
  );
};

const mapStateToProps = state => ({
  formResponses: state?.pactAct?.form,
  viewedIntroPage: state?.pactAct?.viewedIntroPage,
});

const mapDispatchToProps = {
  setBurnPit21: updateBurnPit21,
};

BurnPit21.propTypes = {
  formResponses: PropTypes.object.isRequired,
  setBurnPit21: PropTypes.func.isRequired,
  viewedIntroPage: PropTypes.bool.isRequired,
  router: PropTypes.shape({
    push: PropTypes.func,
  }),
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BurnPit21);
