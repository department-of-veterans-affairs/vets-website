import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  VaButtonPair,
  VaRadio,
  VaRadioOption,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { updateBurnPit210 } from '../../../actions';
import { customizeTitle } from '../../../utilities/customize-title';
import {
  RESPONSES,
  SHORT_NAME_MAP,
} from '../../../utilities/question-data-map';
import { ROUTES } from '../../../constants';

const BurnPit210 = ({ router, burnPit210, updateBurnPit210Field }) => {
  const [formError, setFormError] = useState(false);
  const H1 = 'Burn pit S2.1.0, did you serve in any of these locations?';

  useEffect(() => {
    document.title = customizeTitle(H1);
  });

  const onContinueClick = () => {
    if (burnPit210) {
      setFormError(true);
    }

    setFormError(false);
  };

  const onBackClick = () => {
    router.push(ROUTES.SERVICE_PERIOD);
  };

  const onValueChange = event => {
    const { value } = event?.detail;
    updateBurnPit210Field(value);
  };

  const onBlurInput = () => {
    if (burnPit210) {
      setFormError(false);
    }
  };

  return (
    <>
      <VaRadio
        onBlur={onBlurInput}
        className="vads-u-margin-bottom--3"
        error={(formError && 'TBD error message') || null}
        hint=""
        label={H1}
        onVaValueChange={onValueChange}
      >
        <VaRadioOption
          label={RESPONSES.YES}
          name={RESPONSES.YES}
          value={RESPONSES.YES}
        />
        <VaRadioOption
          label={RESPONSES.NO}
          name={RESPONSES.NO}
          value={RESPONSES.NO}
        />
        <VaRadioOption
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
  servicePeriod: state?.pactAct?.form?.[SHORT_NAME_MAP.BURN_PIT_210],
});

const mapDispatchToProps = {
  updateBurnPit210Field: updateBurnPit210,
};

BurnPit210.propTypes = {
  updateBurnPit210Field: PropTypes.func.isRequired,
  burnPit210: PropTypes.string,
  router: PropTypes.shape({
    push: PropTypes.func,
  }),
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BurnPit210);
