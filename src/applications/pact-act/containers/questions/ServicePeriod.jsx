import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import TernaryRadios from './TernaryRadios';
import { updateServicePeriod } from '../../actions';
import { RESPONSES, SHORT_NAME_MAP } from '../../constants/question-data-map';
import { ROUTES } from '../../constants';
import { pageSetup } from '../../utilities/page-setup';

const ServicePeriod = ({
  formResponses,
  router,
  setServicePeriod,
  viewedIntroPage,
}) => {
  const [formError, setFormError] = useState(false);
  const shortName = SHORT_NAME_MAP.SERVICE_PERIOD;
  const H1 =
    'When did you serve in the U.S. military (including time spent in training)?';
  const servicePeriod = formResponses[shortName];
  const {
    DURING_BOTH_PERIODS,
    EIGHTYNINE_OR_EARLIER,
    NINETY_OR_LATER,
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
    <TernaryRadios
      formError={formError}
      formResponses={formResponses}
      formValue={servicePeriod}
      h1={H1}
      responses={[NINETY_OR_LATER, EIGHTYNINE_OR_EARLIER, DURING_BOTH_PERIODS]}
      router={router}
      setFormError={setFormError}
      shortName={shortName}
      testId="paw-servicePeriod"
      valueSetter={setServicePeriod}
    />
  );
};

const mapStateToProps = state => ({
  formResponses: state?.pactAct?.form,
  viewedIntroPage: state?.pactAct?.viewedIntroPage,
});

const mapDispatchToProps = {
  setServicePeriod: updateServicePeriod,
};

ServicePeriod.propTypes = {
  formResponses: PropTypes.object.isRequired,
  setServicePeriod: PropTypes.func.isRequired,
  viewedIntroPage: PropTypes.bool.isRequired,
  router: PropTypes.shape({
    push: PropTypes.func,
  }),
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ServicePeriod);
