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
  editMode,
}) => {
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
      applyErrorFocus('duw-dropdown');
    } else {
      if (valueHasChanged) {
        // Remove answers from the Redux store if the display path ahead will change.
        cleanUpAnswers(formResponses, updateCleanedFormStore, shortName);
      }

      setFormError(false);
      navigateForward(shortName, formResponses, router, editMode);
    }
  };

  const onBackClick = () => {
    navigateBackward(router);
  };

  return (
    <>
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
      >
        {options}
      </VaSelect>
      <VaButtonPair
        class="vads-u-margin-top--3 small-screen:vads-u-margin-x--0p5"
        data-testid="duw-buttonPair"
        onPrimaryClick={onContinueClick}
        onSecondaryClick={onBackClick}
        continue
      />
    </>
  );
};

Dropdown.propTypes = {
  formError: PropTypes.bool.isRequired,
  formResponses: PropTypes.object.isRequired,
  H1: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  router: PropTypes.object.isRequired,
  setFormError: PropTypes.func.isRequired,
  shortName: PropTypes.string.isRequired,
  testId: PropTypes.string.isRequired,
  updateCleanedFormStore: PropTypes.func.isRequired,
  valueSetter: PropTypes.func.isRequired,
  formValue: PropTypes.string,
};

const mapDispatchToProps = {
  updateCleanedFormStore: updateFormStore,
};

const mapStateToProps = state => ({
  editMode: state?.dischargeUpgradeWizard?.duwForm?.editMode,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Dropdown);
