import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
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
  testId,
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
        // Remove answers from the Redux store if the display path ahead will change.
        cleanUpAnswers(formResponses, updateCleanedFormStore, shortName);
      }

      setFormError(false);
      navigateForward(shortName, formValue, router);
    }
  };

  const onBackClick = () => {
    navigateBackward();
  };

  return (
    <div className="vads-u-margin-top--6">
      <>
        <VaSelect
          autocomplete="false"
          data-testid={testId}
          enable-analytics={false}
          label={H1}
          error={formError ? 'Select a response.' : null}
          name={`${shortName}_dropdown`}
          value={formValue}
          onVaSelect={e => onValueChange(e.detail.value)}
          uswds
        >
          {options}
        </VaSelect>
        <VaButtonPair
          class="vads-u-margin-top--3"
          data-testid="duw-buttonPair"
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
  shortName: PropTypes.string.isRequired,
  router: PropTypes.object.isRequired,
  formResponses: PropTypes.object.isRequired,
  formValue: PropTypes.string,
  formError: PropTypes.bool.isRequired,
  options: PropTypes.array.isRequired,
  H1: PropTypes.string.isRequired,
  valueSetter: PropTypes.func.isRequired,
  setFormError: PropTypes.func.isRequired,
  testId: PropTypes.string.isRequired,
  updateCleanedFormStore: PropTypes.func.isRequired,
};

const mapDispatchToProps = {
  updateCleanedFormStore: updateFormStore,
};

export default connect(
  null,
  mapDispatchToProps,
)(Dropdown);
