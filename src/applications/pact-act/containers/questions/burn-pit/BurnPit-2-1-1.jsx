import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import TernaryRadios from '../TernaryRadios';
import { updateBurnPit211 } from '../../../actions';
import {
  QUESTION_MAP,
  RESPONSES,
  SHORT_NAME_MAP,
} from '../../../constants/question-data-map';
import { ROUTES } from '../../../constants';
import { pageSetup } from '../../../utilities/page-setup';

export const locationList = (
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
      if (!viewedIntroPage) {
        router.push(ROUTES.HOME);
      }
    },
    [router, viewedIntroPage],
  );

  return (
    <TernaryRadios
      formError={formError}
      formResponses={formResponses}
      formValue={burnPit211}
      h1={H1}
      locationList={locationList}
      responses={[YES, NO, NOT_SURE]}
      router={router}
      setFormError={setFormError}
      shortName={shortName}
      testId="paw-burnPit2_1_1"
      valueSetter={setBurnPit211}
    />
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
  router: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  setBurnPit211: PropTypes.func.isRequired,
  viewedIntroPage: PropTypes.bool.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BurnPit211);
