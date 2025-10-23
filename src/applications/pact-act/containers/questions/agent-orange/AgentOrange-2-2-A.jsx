import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import TernaryRadios from '../TernaryRadios';
import { updateOrange22A } from '../../../actions';
import {
  QUESTION_MAP,
  RESPONSES,
  SHORT_NAME_MAP,
} from '../../../constants/question-data-map';
import { ROUTES } from '../../../constants';
import { pageSetup } from '../../../utilities/page-setup';

const Orange22A = ({
  formResponses,
  router,
  setOrange22A,
  viewedIntroPage,
}) => {
  const [formError, setFormError] = useState(false);
  const shortName = SHORT_NAME_MAP.ORANGE_2_2_A;
  const H1 = QUESTION_MAP[shortName];
  const orange22A = formResponses[shortName];
  const {
    KOREA_DMZ,
    NO,
    NOT_SURE,
    VIETNAM_REP,
    VIETNAM_WATERS,
    YES,
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

  const locationList = (
    <ul>
      <li>{VIETNAM_REP}</li>
      <li>{VIETNAM_WATERS}</li>
      <li>{KOREA_DMZ}</li>
    </ul>
  );

  return (
    <TernaryRadios
      formError={formError}
      formResponses={formResponses}
      formValue={orange22A}
      h1={H1}
      locationList={locationList}
      responses={[YES, NO, NOT_SURE]}
      router={router}
      setFormError={setFormError}
      shortName={shortName}
      testId="paw-orange2_2_A"
      valueSetter={setOrange22A}
    />
  );
};

const mapStateToProps = state => ({
  formResponses: state?.pactAct?.form,
  viewedIntroPage: state?.pactAct?.viewedIntroPage,
});

const mapDispatchToProps = {
  setOrange22A: updateOrange22A,
};

Orange22A.propTypes = {
  formResponses: PropTypes.object.isRequired,
  router: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  setOrange22A: PropTypes.func.isRequired,
  viewedIntroPage: PropTypes.bool.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Orange22A);
