import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  VaButtonPair,
  VaRadio,
  VaRadioOption,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { updateServicePeriod } from '../../actions';
import { customizeTitle } from '../../utilities/customize-title';
import { RESPONSES, SHORT_NAME_MAP } from '../../utilities/question-data-map';
import { ROUTES } from '../../constants';
import { navigateForward } from '../../utilities/display-logic';

const ServicePeriod = ({
  formResponses,
  router,
  servicePeriod,
  updateServicePeriodField,
}) => {
  const [formError, setFormError] = useState(false);
  const H1 = 'Service Period 1';

  useEffect(() => {
    document.title = customizeTitle(H1);
  });

  const onContinueClick = () => {
    if (servicePeriod) {
      setFormError(true);
    }

    setFormError(false);
    console.log('continuing!');
    navigateForward(SHORT_NAME_MAP.SERVICE_PERIOD, formResponses, router);
  };

  const onBackClick = () => {
    router.push(ROUTES.HOME);
  };

  const onValueChange = event => {
    const { value } = event?.detail;
    updateServicePeriodField(value);
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
        onBlur={onBlurInput}
        className="vads-u-margin-bottom--3"
        error={(formError && 'TBD error message') || null}
        hint=""
        label={H1}
        onVaValueChange={onValueChange}
      >
        <VaRadioOption
          label={RESPONSES.NINETY_OR_LATER}
          name={RESPONSES.NINETY_OR_LATER}
          value={RESPONSES.NINETY_OR_LATER}
        />
        <VaRadioOption
          label={RESPONSES.EIGHTYNINE_OR_EARLIER}
          name={RESPONSES.EIGHTYNINE_OR_EARLIER}
          value={RESPONSES.EIGHTYNINE_OR_EARLIER}
        />
        <VaRadioOption
          label={RESPONSES.DURING_BOTH_PERIODS}
          name={RESPONSES.DURING_BOTH_PERIODS}
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
  servicePeriod: state?.pactAct?.form?.[SHORT_NAME_MAP.SERVICE_PERIOD],
});

const mapDispatchToProps = {
  updateServicePeriodField: updateServicePeriod,
};

ServicePeriod.propTypes = {
  formResponses: PropTypes.object.isRequired,
  updateServicePeriodField: PropTypes.func.isRequired,
  router: PropTypes.shape({
    push: PropTypes.func,
  }),
  servicePeriod: PropTypes.string,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ServicePeriod);
