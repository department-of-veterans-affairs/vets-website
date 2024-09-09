import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CheckboxGroup from '../CheckboxGroup';
import { updateRadiation23B } from '../../../actions';
import {
  QUESTION_MAP,
  RESPONSES,
  SHORT_NAME_MAP,
} from '../../../constants/question-data-map';
import { ROUTES } from '../../../constants';
import { pageSetup } from '../../../utilities/page-setup';

const Radiation23B = ({
  formResponses,
  router,
  setRadiation23B,
  viewedIntroPage,
}) => {
  const [formError, setFormError] = useState(false);
  const shortName = SHORT_NAME_MAP.RADIATION_2_3_B;
  const H1 = QUESTION_MAP[shortName];
  const radiation23B = formResponses[shortName];

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
    RESPONSES.ENEWETAK_ATOLL,
    RESPONSES.SPAIN_PALOMARES,
    RESPONSES.GREENLAND_THULE,
  ];

  return (
    <CheckboxGroup
      formError={formError}
      formResponses={formResponses}
      formValue={radiation23B}
      h1={H1}
      responses={locations}
      router={router}
      setFormError={setFormError}
      shortName={shortName}
      testId="paw-radiation2_3_B"
      valueSetter={setRadiation23B}
    />
  );
};

const mapStateToProps = state => ({
  formResponses: state?.pactAct?.form,
  viewedIntroPage: state?.pactAct?.viewedIntroPage,
});

const mapDispatchToProps = {
  setRadiation23B: updateRadiation23B,
};

Radiation23B.propTypes = {
  formResponses: PropTypes.object.isRequired,
  router: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  setRadiation23B: PropTypes.func.isRequired,
  viewedIntroPage: PropTypes.bool.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Radiation23B);
