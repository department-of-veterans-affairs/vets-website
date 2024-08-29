import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import TernaryRadios from '../TernaryRadios';
import { updateOrange223 } from '../../../actions';
import {
  QUESTION_MAP,
  RESPONSES,
  SHORT_NAME_MAP,
} from '../../../constants/question-data-map';
import { ROUTES } from '../../../constants';
import { pageSetup } from '../../../utilities/page-setup';

const Orange223 = ({
  formResponses,
  router,
  setOrange223,
  viewedIntroPage,
}) => {
  const [formError, setFormError] = useState(false);
  const shortName = SHORT_NAME_MAP.ORANGE_2_2_3;
  const H1 = QUESTION_MAP[shortName];
  const orange223 = formResponses[shortName];
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
      formValue={orange223}
      h1={H1}
      responses={[YES, NO, NOT_SURE]}
      router={router}
      setFormError={setFormError}
      shortName={shortName}
      testId="paw-orange2_2_3"
      valueSetter={setOrange223}
    />
  );
};

const mapStateToProps = state => ({
  formResponses: state?.pactAct?.form,
  viewedIntroPage: state?.pactAct?.viewedIntroPage,
});

const mapDispatchToProps = {
  setOrange223: updateOrange223,
};

Orange223.propTypes = {
  formResponses: PropTypes.object.isRequired,
  router: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  setOrange223: PropTypes.func.isRequired,
  viewedIntroPage: PropTypes.bool.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Orange223);
