import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  QUESTION_MAP,
  RESPONSES,
  SHORT_NAME_MAP,
} from '../../../constants/question-data-map';
import RadioGroup from './shared/RadioGroup';
import { updatePriorService } from '../../../actions';
import { pageSetup } from '../../../utilities/page-setup';
import { ROUTES } from '../../../constants';

const PriorService = ({
  formResponses,
  setPriorService,
  router,
  viewedIntroPage,
}) => {
  const [formError, setFormError] = useState(false);
  const shortName = SHORT_NAME_MAP.PRIOR_SERVICE;
  const H1 = QUESTION_MAP[shortName];
  const priorService = formResponses[shortName];
  const {
    PRIOR_SERVICE_PAPERWORK_YES,
    PRIOR_SERVICE_PAPERWORK_NO,
    PRIOR_SERVICE_NO,
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

  return (
    <RadioGroup
      formError={formError}
      formResponses={formResponses}
      formValue={priorService}
      H1={H1}
      responses={[
        PRIOR_SERVICE_PAPERWORK_YES,
        PRIOR_SERVICE_PAPERWORK_NO,
        PRIOR_SERVICE_NO,
      ]}
      router={router}
      setFormError={setFormError}
      shortName={shortName}
      testId="duw-prior_service"
      valueSetter={setPriorService}
    />
  );
};

PriorService.propTypes = {
  formResponses: PropTypes.object,
  router: PropTypes.shape({
    push: PropTypes.func,
  }),
  setPriorService: PropTypes.func,
  viewedIntroPage: PropTypes.bool,
};

const mapStateToProps = state => ({
  formResponses: state?.dischargeUpgradeWizard?.duwForm?.form,
  viewedIntroPage: state?.dischargeUpgradeWizard?.duwForm?.viewedIntroPage,
});

const mapDispatchToProps = {
  setPriorService: updatePriorService,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PriorService);
