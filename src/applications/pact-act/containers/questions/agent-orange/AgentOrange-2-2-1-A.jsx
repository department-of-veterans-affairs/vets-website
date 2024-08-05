import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import TernaryRadios from '../TernaryRadios';
import { updateOrange221A } from '../../../actions';
import {
  QUESTION_MAP,
  RESPONSES,
  SHORT_NAME_MAP,
} from '../../../constants/question-data-map';
import { ROUTES } from '../../../constants';
import { pageSetup } from '../../../utilities/page-setup';

const Orange221A = ({
  formResponses,
  router,
  setOrange221A,
  viewedIntroPage,
}) => {
  const [formError, setFormError] = useState(false);
  const shortName = SHORT_NAME_MAP.ORANGE_2_2_1_A;
  const H1 = QUESTION_MAP[shortName];
  const orange221A = formResponses[shortName];
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

  const locationList = (
    <ul>
      <li>{RESPONSES.AMERICAN_SAMOA}</li>
      <li>{RESPONSES.CAMBODIA}</li>
      <li>{RESPONSES.GUAM}</li>
      <li>{RESPONSES.JOHNSTON_ATOLL}</li>
      <li>{RESPONSES.LAOS}</li>
      <li>{RESPONSES.THAILAND}</li>
    </ul>
  );

  return (
    <TernaryRadios
      formError={formError}
      formResponses={formResponses}
      formValue={orange221A}
      h1={H1}
      locationList={locationList}
      responses={[YES, NO, NOT_SURE]}
      router={router}
      setFormError={setFormError}
      shortName={shortName}
      testId="paw-orange2_2_1_A"
      valueSetter={setOrange221A}
    />
  );
};

const mapStateToProps = state => ({
  formResponses: state?.pactAct?.form,
  viewedIntroPage: state?.pactAct?.viewedIntroPage,
});

const mapDispatchToProps = {
  setOrange221A: updateOrange221A,
};

Orange221A.propTypes = {
  formResponses: PropTypes.object.isRequired,
  router: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  setOrange221A: PropTypes.func.isRequired,
  viewedIntroPage: PropTypes.bool.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Orange221A);
