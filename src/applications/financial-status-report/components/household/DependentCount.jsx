import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { focusElement } from 'platform/utilities/ui';
import { useSelector, useDispatch } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import { VaNumberInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import DependentExplainer from './DependentExplainer';
import ButtonGroup from '../shared/ButtonGroup';
import useClearSpouseData from '../../hooks/useClearSpouseData';

const WHOLE_NUMBER_PATTERN = /^\d+$/;

const DependentCount = ({
  goBack,
  goToPath,
  contentBeforeButtons,
  contentAfterButtons,
}) => {
  const headerRef = useRef(null);
  const dispatch = useDispatch();
  const formData = useSelector(state => state.form.data);
  const {
    questions: { hasDependents, isMarried },
    reviewNavigation = false,
    'view:reviewPageNavigationToggle': showReviewNavigation,
  } = formData;

  const MAXIMUM_DEPENDENT_COUNT = 25;

  const [error, setError] = useState(null);
  const [dependents, setDependents] = useState(hasDependents);
  // Hook will handle the logic based on isMarried.
  useClearSpouseData(isMarried, formData, setData);
  // Header ref for setting focus
  useEffect(
    () => {
      if (headerRef?.current) {
        focusElement(headerRef?.current);
      }
    },
    [headerRef],
  );

  function determineNextPath() {
    // Navigate to 'review-and-submit' if reviewNavigation and showReviewNavigation are true,
    if (dependents === '0' && reviewNavigation && showReviewNavigation) {
      return '/review-and-submit';
    }

    // If dependents is '0' but not in review mode, navigate to 'employment-question'.
    if (dependents === '0') {
      return '/employment-question';
    }

    // Default to 'dependent-ages' if none of the above conditions are met.
    return '/dependent-ages';
  }

  const validateAndNavigate = () => {
    // Validate input and prepare navigation based on the updated form data
    if (
      !WHOLE_NUMBER_PATTERN.test(dependents) ||
      dependents > MAXIMUM_DEPENDENT_COUNT ||
      dependents < 0
    ) {
      setError('Please enter a valid number of dependents (0-25).');
      focusElement('#dependent-count');
      return;
    }

    setError(null);

    // Update the formData in Redux store
    dispatch(
      setData({
        ...formData,
        questions: { ...formData.questions, hasDependents: dependents },
        personalData:
          dependents === '0'
            ? { ...formData.personalData, dependents: [] }
            : formData.personalData,
      }),
    );
    // Determine and navigate to the next path based on the dependents value
    goToPath(determineNextPath());
  };

  const handleSubmit = event => {
    event.preventDefault();
    validateAndNavigate();
  };

  return (
    <form onSubmit={handleSubmit}>
      <fieldset className="vads-u-margin-y--2">
        <legend className="schemaform-block-title">
          <h3 className="vads-u-margin--0" ref={headerRef}>
            Your dependents
          </h3>
        </legend>
        <VaNumberInput
          label="Number of dependents"
          error={error}
          hint="Dependents include your spouse, unmarried children under 18 years old, and other dependents."
          id="dependent-count"
          name="dependent-count"
          onBlur={() => {
            if (!WHOLE_NUMBER_PATTERN.test(dependents)) {
              setError('Please enter your dependent(s) information');
              focusElement('va-number-input');
              return;
            }

            if (dependents > MAXIMUM_DEPENDENT_COUNT || dependents < 0) {
              setError(
                'Please enter a value greater than or equal to 0 and less than 25',
              );
              focusElement('va-number-input');
            }
          }}
          onInput={({ target }) => {
            setDependents(target.value);
          }}
          inputMode="number"
          value={dependents}
          className="no-wrap input-size-2"
          required
          min={0}
          max={MAXIMUM_DEPENDENT_COUNT}
          uswds
        />
        <DependentExplainer />
      </fieldset>
      {contentBeforeButtons}
      <ButtonGroup
        buttons={[
          {
            label: 'Back',
            isBackButton: true,
            onClick: goBack,
            isSecondary: true,
          },
          {
            label: 'Continue',
            isContinueButton: true,
            onClick: handleSubmit,
            isSubmitting: true,
          },
        ]}
      />

      {contentAfterButtons}
    </form>
  );
};

DependentCount.propTypes = {
  data: PropTypes.shape({
    questions: PropTypes.shape({
      hasDependents: PropTypes.string,
      isMarried: PropTypes.bool,
    }),
    personalData: PropTypes.shape({
      dependents: PropTypes.array,
    }),
    reviewNavigation: PropTypes.bool,
    'view:reviewPageNavigationToggle': PropTypes.bool,
  }).isRequired,
  goBack: PropTypes.func.isRequired,
  goForward: PropTypes.func.isRequired,
  goToPath: PropTypes.func.isRequired,
  setFormData: PropTypes.func.isRequired,
  contentAfterButtons: PropTypes.node,
  contentBeforeButtons: PropTypes.node,
};

export default DependentCount;
