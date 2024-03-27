import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import Scroll from 'react-scroll';
import {
  VaSelect,
  VaButtonPair,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import {
  navigateBackward,
  navigateForward,
} from '../../../../utilities/page-navigation';
import { cleanUpAnswers } from '../../../../utilities/answer-cleanup';
import { updateFormStore } from '../../../../actions';

const Dropdown = ({
  shortName,
  router,
  formResponses,
  formValue,
  formError,
  options,
  H1,
  valueSetter,
  setFormError,
  updateCleanedFormStore,
}) => {
  const [valueHasChanged, setValueHasChanged] = useState(false);

  const onValueChange = value => {
    valueSetter(value);

    if (formValue) {
      setValueHasChanged(true);
    }

    if (value) {
      setFormError(false);
    }
  };

  const onContinueClick = () => {
    if (!formValue) {
      setFormError(true);
    } else {
      if (valueHasChanged) {
        // Remove answers from the Redux store if the display path ahead has changed
        cleanUpAnswers(formResponses, updateCleanedFormStore, shortName);
      }

      setFormError(false);
      navigateForward(shortName, formValue, router, formResponses);
    }
  };

  const onBackClick = () => {
    navigateBackward(shortName, formValue, router);
  };

  return (
    <div className="vads-u-margin-top--6">
      <>
        <VaSelect
          autocomplete="false"
          label={H1}
          error={formError ? 'Select a response.' : null}
          value={formValue}
          onVaSelect={e => onValueChange(e.detail.value)}
          uswds
        >
          {options}
        </VaSelect>
        <VaButtonPair
          class="vads-u-margin-top--3"
          data-testid="paw-buttonPair"
          onPrimaryClick={onContinueClick}
          onSecondaryClick={onBackClick}
          continue
          uswds
        />
      </>
    </div>
  );
};

Dropdown.propTypes = {
  options: PropTypes.array.isRequired,
};

const mapDispatchToProps = {
  updateCleanedFormStore: updateFormStore,
};

export default connect(
  null,
  mapDispatchToProps,
)(Dropdown);
