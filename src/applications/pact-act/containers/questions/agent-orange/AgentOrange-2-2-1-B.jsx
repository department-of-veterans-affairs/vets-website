import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CheckboxGroup from '../CheckboxGroup';
import { updateOrange221B } from '../../../actions';
import {
  QUESTION_MAP,
  SHORT_NAME_MAP,
} from '../../../constants/question-data-map';
import { ROUTES } from '../../../constants';
import { pageSetup } from '../../../utilities/page-setup';

const Orange221B = ({
  formResponses,
  router,
  setOrange221B,
  viewedIntroPage,
}) => {
  const [formError, setFormError] = useState(false);
  const shortName = SHORT_NAME_MAP.ORANGE_2_2_1_B;
  const H1 = QUESTION_MAP[shortName];
  const orange221B = formResponses[shortName];

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

  const locationList = [
    'American Samoa or its territorial waters',
    'Cambodia at Mimot or Krek, Kampong Cham Province',
    'Guam or its territorial waters',
    'Johnston Atoll or on a ship that called at Johnston Atoll',
    'Laos',
    'On a U.S. or Royal Thai military base in Thailand',
  ];

  return (
    <CheckboxGroup
      formError={formError}
      formResponses={formResponses}
      formValue={orange221B}
      h1={H1}
      responses={locationList}
      router={router}
      setFormError={setFormError}
      shortName={shortName}
      testId="paw-orange2_2_1_B"
      valueSetter={setOrange221B}
    />
  );
};

const mapStateToProps = state => ({
  formResponses: state?.pactAct?.form,
  viewedIntroPage: state?.pactAct?.viewedIntroPage,
});

const mapDispatchToProps = {
  setOrange221B: updateOrange221B,
};

Orange221B.propTypes = {
  formResponses: PropTypes.object.isRequired,
  setOrange221B: PropTypes.func.isRequired,
  viewedIntroPage: PropTypes.bool.isRequired,
  router: PropTypes.shape({
    push: PropTypes.func,
  }),
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Orange221B);
