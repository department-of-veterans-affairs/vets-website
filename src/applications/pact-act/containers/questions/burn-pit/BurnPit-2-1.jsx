import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  VaButtonPair,
  VaRadio,
  VaRadioOption,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { updateBurnPit21 } from '../../../actions';
import {
  RESPONSES,
  SHORT_NAME_MAP,
} from '../../../utilities/question-data-map';
import { ROUTES } from '../../../constants';
import {
  areDisplayConditionsMet,
  navigateForward,
} from '../../../utilities/display-logic';
import { pageSetup } from '../../../utilities/page-setup';

const BurnPit21 = ({
  formResponses,
  router,
  setBurnPit21,
  viewedIntroPage,
}) => {
  const [formError, setFormError] = useState(false);
  const H1 = 'Burn pit S2.1.0, did you serve in any of these locations?';
  const burnPit21 = formResponses[SHORT_NAME_MAP.BURN_PIT_2_1];

  useEffect(() => {
    pageSetup(H1);
  });

  useEffect(
    () => {
      if (
        !viewedIntroPage ||
        !areDisplayConditionsMet(SHORT_NAME_MAP.BURN_PIT_2_1, formResponses)
      ) {
        router.push(ROUTES.HOME);
      }
    },
    [formResponses, router, viewedIntroPage],
  );

  const onContinueClick = () => {
    if (!burnPit21) {
      setFormError(true);
    } else {
      setFormError(false);
      navigateForward(SHORT_NAME_MAP.BURN_PIT_2_1, formResponses, router);
    }
  };

  const onBackClick = () => {
    router.push(ROUTES.SERVICE_PERIOD);
  };

  const onValueChange = event => {
    const { value } = event?.detail;
    setBurnPit21(value);

    if (value) {
      setFormError(false);
    }
  };

  const onBlurInput = () => {
    if (burnPit21) {
      setFormError(false);
    }
  };

  return (
    <>
      <h1>{H1}</h1>
      <VaRadio
        data-testid="paw-burnPit2_1"
        onBlur={onBlurInput}
        className="vads-u-margin-bottom--3"
        error={(formError && 'TBD error message') || null}
        hint=""
        label={H1}
        onVaValueChange={onValueChange}
      >
        <ul>
          <li>Bahrain</li>
          <li>Iraq</li>
          <li>Kuwait</li>
          <li>Oman</li>
          <li>Qatar</li>
          <li>Saudi Arabia</li>
          <li>Somalia</li>
          <li>The United Arab Emirates (UAE)</li>
          <li>The airspace above any of these locations</li>
        </ul>
        <VaRadioOption
          checked={burnPit21 === RESPONSES.YES}
          label={RESPONSES.YES}
          name={RESPONSES.YES}
          value={RESPONSES.YES}
        />
        <VaRadioOption
          checked={burnPit21 === RESPONSES.NO}
          label={RESPONSES.NO}
          name={RESPONSES.NO}
          value={RESPONSES.NO}
        />
        <VaRadioOption
          checked={burnPit21 === RESPONSES.NOT_SURE}
          label={RESPONSES.NOT_SURE}
          name={RESPONSES.NOT_SURE}
          value={RESPONSES.NOT_SURE}
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
  setBurnPit21: updateBurnPit21,
};

BurnPit21.propTypes = {
  formResponses: PropTypes.object.isRequired,
  setBurnPit21: PropTypes.func.isRequired,
  viewedIntroPage: PropTypes.bool.isRequired,
  router: PropTypes.shape({
    push: PropTypes.func,
  }),
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BurnPit21);
