import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  QUESTION_MAP,
  RESPONSES,
  SHORT_NAME_MAP,
} from '../../../constants/question-data-map';
import RadioGroup from './shared/RadioGroup';
import { updateCourtMartial } from '../../../actions';
import { pageSetup } from '../../../utilities/page-setup';
import { ROUTES } from '../../../constants';

const CourtMartial = ({
  formResponses,
  setCourtMartial,
  router,
  viewedIntroPage,
}) => {
  const [formError, setFormError] = useState(false);
  const shortName = SHORT_NAME_MAP.COURT_MARTIAL;
  const H1 = QUESTION_MAP[shortName];
  const courtMartial = formResponses[shortName];
  const { COURT_MARTIAL_YES, COURT_MARTIAL_NO, NOT_SURE } = RESPONSES;

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
    <RadioGroup
      formError={formError}
      formResponses={formResponses}
      formValue={courtMartial}
      H1={H1}
      responses={[COURT_MARTIAL_YES, COURT_MARTIAL_NO, NOT_SURE]}
      router={router}
      setFormError={setFormError}
      shortName={shortName}
      testId="duw-court_martial"
      valueSetter={setCourtMartial}
    />
  );
};

CourtMartial.propTypes = {
  formResponses: PropTypes.object,
  router: PropTypes.shape({
    push: PropTypes.func,
  }),
  setCourtMartial: PropTypes.func,
  viewedIntroPage: PropTypes.bool,
};

const mapStateToProps = state => ({
  formResponses: state?.dischargeUpgradeWizard?.duwForm?.form,
  viewedIntroPage: state?.dischargeUpgradeWizard?.duwForm?.viewedIntroPage,
});

const mapDispatchToProps = {
  setCourtMartial: updateCourtMartial,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CourtMartial);
