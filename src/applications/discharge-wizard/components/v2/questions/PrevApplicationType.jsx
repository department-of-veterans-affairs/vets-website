import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  QUESTION_MAP,
  RESPONSES,
  SHORT_NAME_MAP,
} from '../../../constants/question-data-map';
import RadioGroup from './shared/RadioGroup';
import { updatePrevApplicationType } from '../../../actions';
import { pageSetup } from '../../../utilities/page-setup';
import { ROUTES } from '../../../constants';

const PrevApplicationType = ({
  formResponses,
  setPrevApplicationType,
  router,
  viewedIntroPage,
}) => {
  const [formError, setFormError] = useState(false);
  const shortName = SHORT_NAME_MAP.PREV_APPLICATION_TYPE;
  const H1 = QUESTION_MAP[shortName];
  const prevApplicationType = formResponses[shortName];
  const {
    PREV_APPLICATION_DRB_DOCUMENTARY,
    PREV_APPLICATION_DRB_PERSONAL,
    PREV_APPLICATION_BCMR,
    PREV_APPLICATION_BCNR,
    NOT_SURE,
  } = RESPONSES;

  const prevApplicationTypeOptions = [
    PREV_APPLICATION_DRB_DOCUMENTARY,
    PREV_APPLICATION_DRB_PERSONAL,
    PREV_APPLICATION_BCMR,
    PREV_APPLICATION_BCNR,
    NOT_SURE,
  ].filter(option => {
    if (
      [RESPONSES.NAVY, RESPONSES.MARINE_CORPS].includes(
        formResponses.SERVICE_BRANCH,
      )
    ) {
      return option !== PREV_APPLICATION_BCMR;
    }
    return option !== PREV_APPLICATION_BCNR;
  });

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
      formValue={prevApplicationType}
      H1={H1}
      responses={prevApplicationTypeOptions}
      router={router}
      setFormError={setFormError}
      shortName={shortName}
      testId="duw-prev_application_type"
      valueSetter={setPrevApplicationType}
    />
  );
};

PrevApplicationType.propTypes = {
  formResponses: PropTypes.object,
  router: PropTypes.shape({
    push: PropTypes.func,
  }),
  setPrevApplicationType: PropTypes.func,
  viewedIntroPage: PropTypes.bool,
};

const mapStateToProps = state => ({
  formResponses: state?.dischargeUpgradeWizard?.duwForm?.form,
  viewedIntroPage: state?.dischargeUpgradeWizard?.duwForm?.viewedIntroPage,
});

const mapDispatchToProps = {
  setPrevApplicationType: updatePrevApplicationType,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PrevApplicationType);
