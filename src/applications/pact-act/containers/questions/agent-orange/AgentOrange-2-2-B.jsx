import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CheckboxGroup from '../CheckboxGroup';
import { updateOrange22B } from '../../../actions';
import {
  QUESTION_MAP,
  RESPONSES,
  SHORT_NAME_MAP,
} from '../../../constants/question-data-map';
import { ROUTES } from '../../../constants';
import { pageSetup } from '../../../utilities/page-setup';

const Orange22B = ({
  formResponses,
  router,
  setOrange22B,
  viewedIntroPage,
}) => {
  const [formError, setFormError] = useState(false);
  const shortName = SHORT_NAME_MAP.ORANGE_2_2_B;
  const H1 = QUESTION_MAP[shortName];
  const orange22B = formResponses[shortName];

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

  const locations = [
    RESPONSES.VIETNAM_REP,
    RESPONSES.VIETNAM_WATERS,
    RESPONSES.KOREA_DMZ,
  ];

  return (
    <CheckboxGroup
      formError={formError}
      formResponses={formResponses}
      formValue={orange22B}
      h1={H1}
      responses={locations}
      router={router}
      setFormError={setFormError}
      shortName={shortName}
      testId="paw-orange2_2_B"
      valueSetter={setOrange22B}
    />
  );
};

const mapStateToProps = state => ({
  formResponses: state?.pactAct?.form,
  viewedIntroPage: state?.pactAct?.viewedIntroPage,
});

const mapDispatchToProps = {
  setOrange22B: updateOrange22B,
};

Orange22B.propTypes = {
  formResponses: PropTypes.object.isRequired,
  router: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  setOrange22B: PropTypes.func.isRequired,
  viewedIntroPage: PropTypes.bool.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Orange22B);
