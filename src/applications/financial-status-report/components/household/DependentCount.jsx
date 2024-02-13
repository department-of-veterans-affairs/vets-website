import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { focusElement } from 'platform/utilities/ui';
import { VaNumberInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import DependentExplainer from './DependentExplainer';
import ButtonGroup from '../shared/ButtonGroup';
import useClearSpouseData from '../../hooks/useClearSpouseData';

const WHOLE_NUMBER_PATTERN = /^\d+$/;

const DependentCount = ({
  data,
  goBack,
  goToPath,
  setFormData,
  contentBeforeButtons,
  contentAfterButtons,
}) => {
  const headerRef = useRef(null);

  const {
    questions: { hasDependents, isMarried },
    reviewNavigation = false,
    'view:reviewPageNavigationToggle': showReviewNavigation,
  } = data;

  const MAXIMUM_DEPENDENT_COUNT = 25;

  const [error, setError] = useState(null);
  const [dependents, setDependents] = useState(hasDependents || '0');

  // Correctly handle the hook to clear spouse data based on marital status
  useClearSpouseData(isMarried, data, setFormData);

  useEffect(
    () => {
      if (headerRef.current) {
        focusElement(headerRef.current);
      }
    },
    [headerRef],
  );

  useEffect(
    () => {
      setDependents(hasDependents || '0');
    },
    [hasDependents],
  );

  const determineNextPath = () => {
    if (dependents === '0' && reviewNavigation && showReviewNavigation) {
      setFormData({
        ...data,
        reviewNavigation: false,
      });
      return '/review-and-submit';
    }
    if (dependents === '0') {
      return '/employment-question';
    }
    return '/dependent-ages';
  };

  const validateInput = () => {
    if (
      !WHOLE_NUMBER_PATTERN.test(dependents) ||
      dependents > MAXIMUM_DEPENDENT_COUNT ||
      dependents < 0
    ) {
      setError('Please enter a valid number of dependents (0-25).');
      focusElement('#dependent-count');
      return false;
    }
    setError(null);
    return true;
  };

  const handleSubmit = event => {
    event.preventDefault();
    if (validateInput()) {
      goToPath(determineNextPath());
    }
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
          id="dependent-count"
          label="Number of dependents"
          error={error}
          onInput={({ target }) => {
            const newValue = target?.value;
            setDependents(newValue); // Update local state first
            setFormData({
              ...data,
              questions: {
                ...data?.questions,
                hasDependents: newValue, // Use the new value
              },
              personalData:
                newValue === '0'
                  ? { ...data?.personalData, dependents: [] }
                  : data?.personalData,
            });
          }}
          value={dependents.toString()} // Ensure value is always a string
          inputMode="numeric" // Use "numeric" for better mobile keyboard support
          className="no-wrap input-size-2"
          min={0}
          max={MAXIMUM_DEPENDENT_COUNT}
          required
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
