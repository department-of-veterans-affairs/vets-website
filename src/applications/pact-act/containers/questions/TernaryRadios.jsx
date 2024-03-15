import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  VaButtonPair,
  VaRadio,
  VaRadioOption,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import {
  navigateBackward,
  navigateForward,
} from '../../utilities/page-navigation';
import { updateFormStore } from '../../actions';
import { cleanUpAnswers } from '../../utilities/answer-cleanup';
import { SHORT_NAME_MAP } from '../../constants/question-data-map';
import { applyFocus } from '../../utilities/page-setup';

/**
 * Produces a set of 3 radio options
 * @param {string} formValue - The response for this question in the Redux store
 * @param {array[string]} responses - The responses available for this question
 * @param {string} shortName - Question short name (SNAKE_CASE)
 */
const TernaryRadios = ({
  formError,
  formResponses,
  formValue,
  h1,
  locationList,
  responses,
  router,
  setFormError,
  shortName,
  testId,
  updateCleanedFormStore,
  valueSetter,
}) => {
  const [valueHasChanged, setValueHasChanged] = useState(false);
  const [headerHasFocused, setHeaderHasFocused] = useState(false);

  const onContinueClick = () => {
    if (!formValue) {
      setFormError(true);
    } else {
      if (valueHasChanged) {
        // Remove answers from the Redux store if the display path ahead has changed
        cleanUpAnswers(formResponses, updateCleanedFormStore, shortName);
      }

      setFormError(false);
      navigateForward(shortName, formResponses, router);
    }
  };

  const onBackClick = () => {
    navigateBackward(shortName, formResponses, router);
  };

  const onValueChange = value => {
    valueSetter(value);

    if (formValue) {
      setValueHasChanged(true);
    }

    if (value) {
      setFormError(false);
    }
  };

  const renderRadioOptions = () => {
    return responses.map((response, index) => {
      return (
        <VaRadioOption
          key={index}
          checked={formValue === response}
          data-testid="va-radio-option"
          label={response}
          name="group"
          value={response}
          uswds
        />
      );
    });
  };

  return (
    <>
      <VaRadio
        data-testid={testId}
        form-heading={h1}
        form-heading-level={1}
        error={formError ? 'Select a response.' : null}
        id="paw-radio"
        onVaValueChange={e => onValueChange(e.detail.value)}
        onLoad={applyFocus('paw-radio', headerHasFocused, setHeaderHasFocused)}
        use-forms-pattern="single"
        uswds
      >
        {shortName === SHORT_NAME_MAP.ORANGE_2_2_2 && (
          <div id="paw-orange-2-2-2-info" data-testid="paw-orange-2-2-2-info">
            <va-additional-info
              trigger="Learn more about C-123 airplanes"
              uswds
            >
              <p className="vads-u-margin-top--0">
                The U.S. Air Force used C-123 planes to spray Agent Orange to
                clear jungles that provided enemy cover in Vietnam. After 1971,
                the Air Force reassigned the remaining C-123 planes to Air Force
                Reserve units in the U.S. for routine cargo and medical
                evacuation missions. Veterans, including some Reservists, who
                flew, trained, or worked on C-123 planes anytime from 1969 to
                1986 may have had exposure to Agent Orange.
              </p>
            </va-additional-info>
          </div>
        )}
        {renderRadioOptions()}
        <div slot="form-description">{locationList}</div>
      </VaRadio>
      <VaButtonPair
        class="vads-u-margin-top--3"
        data-testid="paw-buttonPair"
        onPrimaryClick={onContinueClick}
        onSecondaryClick={onBackClick}
        continue
        uswds
      />
    </>
  );
};

const mapDispatchToProps = {
  updateCleanedFormStore: updateFormStore,
};

TernaryRadios.propTypes = {
  formError: PropTypes.bool.isRequired,
  formResponses: PropTypes.object.isRequired,
  h1: PropTypes.string.isRequired,
  responses: PropTypes.arrayOf(PropTypes.string).isRequired,
  router: PropTypes.object.isRequired,
  setFormError: PropTypes.func.isRequired,
  shortName: PropTypes.string.isRequired,
  testId: PropTypes.string.isRequired,
  updateCleanedFormStore: PropTypes.func.isRequired,
  valueSetter: PropTypes.func.isRequired,
  formValue: PropTypes.string,
  locationList: PropTypes.node,
};

export default connect(
  null,
  mapDispatchToProps,
)(TernaryRadios);
