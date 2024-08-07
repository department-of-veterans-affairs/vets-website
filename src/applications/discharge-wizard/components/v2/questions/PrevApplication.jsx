import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  QUESTION_MAP,
  RESPONSES,
  SHORT_NAME_MAP,
} from '../../../constants/question-data-map';
import RadioGroup from './shared/RadioGroup';
import { updatePrevApplication } from '../../../actions';
import { pageSetup } from '../../../utilities/page-setup';
import { ROUTES } from '../../../constants';

const PrevApplication = ({
  formResponses,
  setPrevApplication,
  router,
  viewedIntroPage,
}) => {
  const [formError, setFormError] = useState(false);
  const shortName = SHORT_NAME_MAP.PREV_APPLICATION;
  const H1 = QUESTION_MAP[shortName];
  const prevApplication = formResponses[shortName];
  const { YES, NO } = RESPONSES;
  const hint =
    'Note: You can still apply even if you’ve been denied before. We’ll tell you where to send your application based on your answer. ';

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
      formValue={prevApplication}
      H1={H1}
      hint={hint}
      responses={[YES, NO]}
      router={router}
      setFormError={setFormError}
      shortName={shortName}
      testId="duw-prev_application"
      valueSetter={setPrevApplication}
    />
  );
};

PrevApplication.propTypes = {
  formResponses: PropTypes.object,
  router: PropTypes.shape({
    push: PropTypes.func,
  }),
  setPrevApplication: PropTypes.func,
  viewedIntroPage: PropTypes.bool,
};

const mapStateToProps = state => ({
  formResponses: state?.dischargeUpgradeWizard?.duwForm?.form,
  viewedIntroPage: state?.dischargeUpgradeWizard?.duwForm?.viewedIntroPage,
});

const mapDispatchToProps = {
  setPrevApplication: updatePrevApplication,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PrevApplication);
