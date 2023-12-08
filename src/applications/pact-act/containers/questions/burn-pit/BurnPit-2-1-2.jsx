import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import TernaryRadios from '../TernaryRadios';
import { updateBurnPit212 } from '../../../actions';
import {
  QUESTION_MAP,
  RESPONSES,
  SHORT_NAME_MAP,
} from '../../../constants/question-data-map';
import { ROUTES } from '../../../constants';
import { pageSetup } from '../../../utilities/page-setup';

export const locationList = (
  <ul>
    <li>Afghanistan</li>
    <li>Djibouti</li>
    <li>Egypt</li>
    <li>Jordan</li>
    <li>Lebanon</li>
    <li>Syria</li>
    <li>Uzbekistan</li>
    <li>Yemen</li>
    <li>The airspace above any of these locations</li>
  </ul>
);

const BurnPit212 = ({
  formResponses,
  router,
  setBurnPit212,
  viewedIntroPage,
}) => {
  const [formError, setFormError] = useState(false);
  const shortName = SHORT_NAME_MAP.BURN_PIT_2_1_2;
  const H1 = QUESTION_MAP[shortName];
  const burnPit212 = formResponses[shortName];
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
      formValue={burnPit212}
      h1={H1}
      locationList={locationList}
      responses={[YES, NO, NOT_SURE]}
      router={router}
      setFormError={setFormError}
      shortName={shortName}
      testId="paw-burnPit2_1_2"
      valueSetter={setBurnPit212}
    />
  );
};

const mapStateToProps = state => ({
  formResponses: state?.pactAct?.form,
  viewedIntroPage: state?.pactAct?.viewedIntroPage,
});

const mapDispatchToProps = {
  setBurnPit212: updateBurnPit212,
};

BurnPit212.propTypes = {
  formResponses: PropTypes.object.isRequired,
  setBurnPit212: PropTypes.func.isRequired,
  viewedIntroPage: PropTypes.bool.isRequired,
  router: PropTypes.shape({
    push: PropTypes.func,
  }),
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BurnPit212);
