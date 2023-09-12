import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  VaButtonPair,
  VaRadio,
  VaRadioOption,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { updateServicePeriod } from '../../actions';
import { RESPONSES, SHORT_NAME_MAP } from '../../utilities/question-data-map';
import { ROUTES } from '../../constants';
import { navigateForward } from '../../utilities/display-logic';
import { pageSetup } from '../../utilities/page-setup';

const ServicePeriod = ({
  formResponses,
  router,
  setServicePeriod,
  viewedIntroPage,
}) => {
  const [formError, setFormError] = useState(false);
  const H1 = 'Service Period 1';
  const servicePeriod = formResponses[SHORT_NAME_MAP.SERVICE_PERIOD];

  useEffect(() => {
    pageSetup(H1);
  });

  useEffect(
    () => {
      if (!viewedIntroPage) {
        router.push(ROUTES.HOME);
      }
    },
    [router, viewedIntroPage],
  );

  const onContinueClick = () => {
    if (!servicePeriod) {
      setFormError(true);
    } else {
      setFormError(false);
      navigateForward(SHORT_NAME_MAP.SERVICE_PERIOD, formResponses, router);
    }
  };

  const onBackClick = () => {
    router.push(ROUTES.HOME);
  };

  const onValueChange = event => {
    const { value } = event?.detail;
    setServicePeriod(value);

    if (value) {
      setFormError(false);
    }
  };

  const onBlurInput = () => {
    if (servicePeriod) {
      setFormError(false);
    }
  };

  return (
    <>
      <h1>{H1}</h1>
      <VaRadio
        data-testid="paw-servicePeriod"
        onBlur={onBlurInput}
        className="vads-u-margin-bottom--3"
        error={(formError && 'TBD error message') || null}
        hint=""
        label={H1}
        onVaValueChange={onValueChange}
      >
        <VaRadioOption
          checked={servicePeriod === RESPONSES.NINETY_OR_LATER}
          label={RESPONSES.NINETY_OR_LATER}
          name={SHORT_NAME_MAP.SERVICE_PERIOD}
          value={RESPONSES.NINETY_OR_LATER}
        />
        <VaRadioOption
          checked={servicePeriod === RESPONSES.EIGHTYNINE_OR_EARLIER}
          label={RESPONSES.EIGHTYNINE_OR_EARLIER}
          name={SHORT_NAME_MAP.SERVICE_PERIOD}
          value={RESPONSES.EIGHTYNINE_OR_EARLIER}
        />
        <VaRadioOption
          checked={servicePeriod === RESPONSES.DURING_BOTH_PERIODS}
          label={RESPONSES.DURING_BOTH_PERIODS}
          name={SHORT_NAME_MAP.SERVICE_PERIOD}
          value={RESPONSES.DURING_BOTH_PERIODS}
        />
      </VaRadio>
      <VaButtonPair
        data-testid="paw-buttonPair"
        onPrimaryClick={onContinueClick}
        onSecondaryClick={onBackClick}
        continue
      />
    </>
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
