import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import TernaryRadios from '../TernaryRadios';
import { updateMainFlow25 } from '../../../actions';
import {
  QUESTION_MAP,
  RESPONSES,
  SHORT_NAME_MAP,
} from '../../../constants/question-data-map';
import { ROUTES } from '../../../constants';
import { pageSetup } from '../../../utilities/page-setup';

const MainFlow25 = ({
  formResponses,
  router,
  setMainFlow25,
  viewedIntroPage,
}) => {
  const [formError, setFormError] = useState(false);
  const shortName = SHORT_NAME_MAP.MAIN_FLOW_2_5;
  const H1 = QUESTION_MAP[shortName];
  const mainFlow25 = formResponses[shortName];
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
      <li>
        Air pollutants (like burn pits, sand, dust, particulates, oil well
        fires, or sulfur fires)
      </li>
      <li>
        Chemicals (like pesticides, herbicides, depleted uranium with embedded
        shrapnel, or contaminated water)
      </li>
      <li>
        Job-related hazards (like asbestos, industrial solvents, lead, paints
        including chemical agent resistant coating, firefighting foams)
      </li>
      <li>
        Radiation (from sources like nuclear weapons, radioactive materials,
        X-rays, or nuclear submarines or ships)
      </li>
      <li>
        Warfare agents (like nerve agents or chemical or biological weapons)
      </li>
    </ul>
  );

  return (
    <TernaryRadios
      formError={formError}
      formResponses={formResponses}
      formValue={mainFlow25}
      h1={H1}
      locationList={locationList}
      responses={[YES, NO, NOT_SURE]}
      router={router}
      setFormError={setFormError}
      shortName={shortName}
      testId="paw-mainFlow2_5"
      textAfterList="Note: This list is not a complete list of possible exposures."
      textBeforeList="Here are some examples of possible exposures or hazards:"
      valueSetter={setMainFlow25}
    />
  );
};

const mapStateToProps = state => ({
  formResponses: state?.pactAct?.form,
  viewedIntroPage: state?.pactAct?.viewedIntroPage,
});

const mapDispatchToProps = {
  setMainFlow25: updateMainFlow25,
};

MainFlow25.propTypes = {
  formResponses: PropTypes.object.isRequired,
  router: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  setMainFlow25: PropTypes.func.isRequired,
  viewedIntroPage: PropTypes.bool.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MainFlow25);
