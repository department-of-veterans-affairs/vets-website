import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  VaSelect,
  VaButtonPair,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { waitForRenderThenFocus } from '@department-of-veterans-affairs/platform-utilities/ui';
import {
  navigateBackward,
  navigateForward,
} from '../../../../utilities/page-navigation';
import { cleanUpAnswers } from '../../../../utilities/answer-cleanup';
import { updateFormStore } from '../../../../actions';
import {
  determineErrorMessage,
  determineLabel,
} from '../../../../utilities/shared';
import { applyErrorFocus } from '../../../../utilities/page-setup';

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
  const [headerHasFocused, setHeaderHasFocused] = useState(false);
  const [valueHasChanged, setValueHasChanged] = useState(false);

  useEffect(() => {
    waitForRenderThenFocus('h1');
  }, []);

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
      applyErrorFocus('duw-dropdown', headerHasFocused, setHeaderHasFocused);
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
    navigateBackward(router);
  };

  return (
    <div>
      <h1>{H1}</h1>
      <VaSelect
        autocomplete="false"
        className="vads-u-margin-top--6"
        id="duw-dropdown"
        data-testid={testId}
        enable-analytics={false}
        label={determineLabel(shortName)}
        error={formError ? determineErrorMessage(shortName) : null}
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
