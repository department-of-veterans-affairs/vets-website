import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { focusElement } from 'platform/utilities/ui';
import { VaNumberInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import DependentExplainer from './DependentExplainer';
import ButtonGroup from '../shared/ButtonGroup';

const MAXIMUM_DEPENDENT_COUNT = 25;

const DependentCount = ({
  data,
  goBack,
  goForward,
  goToPath,
  setFormData,
  contentBeforeButtons,
  contentAfterButtons,
}) => {
  const headerRef = useRef(null);
  const formRef = useRef(null);
  const [error, setError] = useState(null);
  const {
    questions: { hasDependents },
    reviewNavigation = false,
    'view:reviewPageNavigationToggle': showReviewNavigation,
  } = data;
  const [dependents, setDependents] = useState(hasDependents);

  useEffect(() => {
    if (headerRef.current) {
      focusElement(headerRef.current);
    }
  }, []);

  const isValidDependents = value => {
    const dependentCount = Number(value);
    return (
      !Number.isNaN(dependentCount) &&
      dependentCount >= 0 &&
      dependentCount <= MAXIMUM_DEPENDENT_COUNT
    );
  };

  const handleInput = ({ target }) => setDependents(target.value);

  const handleBlur = () => {
    if (!isValidDependents(dependents)) {
      setError('Please enter a valid number of dependents (0-25)');
      focusElement('va-number-input');
    } else {
      setError(null);
    }
  };

  const handleSubmit = event => {
    event.preventDefault();
    if (!isValidDependents(dependents)) return;

    // console.log('DependentCount.jsx: handleSubmit: dependents: ', dependents);
    // console.log(typeof dependents);
    const updatedData = {
      ...data,
      questions: {
        ...data.questions,
        hasDependents: dependents,
      },
      personalData:
        dependents === '0'
          ? { ...data.personalData, dependents: [] }
          : data.personalData,
    };

    // Update the form data first
    setFormData(updatedData);

    // Then navigate based on the updated data
    if (dependents === '0' && reviewNavigation && showReviewNavigation) {
      goToPath('/review-and-submit');
    } else {
      // console.log(
      //   'DependentCount.jsx: handleSubmit: goForward: updatedData: ',
      //   updatedData,
      // );
      goForward(updatedData); // This will now use the updated form data
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <fieldset className="vads-u-margin-y--2">
        <legend className="schemaform-block-title">
          <h3 ref={headerRef}>Your dependents</h3>
        </legend>
        <VaNumberInput
          label="Number of dependents"
          error={error}
          hint="Dependents include your spouse, unmarried children under 18 years old, and other dependents."
          id="dependent-count"
          name="dependent-count"
          onBlur={handleBlur}
          onInput={handleInput}
          inputMode="number"
          value={dependents}
          className="no-wrap input-size-2"
          required
          min={0}
          max={MAXIMUM_DEPENDENT_COUNT}
        />
        <DependentExplainer />
      </fieldset>
      {contentBeforeButtons}
      <ButtonGroup
        buttons={[
          {
            label: 'Back',
            onClick: goBack,
            isSecondary: true,
            isBackButton: true,
          },
          {
            label: 'Continue',
            onClick: handleSubmit,
            isSubmitting: true,
            isContinueButton: true,
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
