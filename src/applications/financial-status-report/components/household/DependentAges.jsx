import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { VaNumberInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { setData } from 'platform/forms-system/src/js/actions';
import { DEPENDENT_AGE_LABELS } from '../../constants/dependentLabels';
import { isNumber } from '../../utils/helpers';
import DependentExplainer from './DependentExplainer';
import ButtonGroup from '../shared/ButtonGroup';
import ReviewControl from '../shared/ReviewControl';

const DependentAges = ({
  contentBeforeButtons,
  contentAfterButtons,
  goForward,
  goToPath,
  isReviewMode = false,
}) => {
  const dispatch = useDispatch();
  const formData = useSelector(state => state.form.data);
  const {
    questions: { hasDependents } = {},
    personalData: { dependents = [] } = {},
    reviewNavigation = false,
    'view:reviewPageNavigationToggle': showReviewNavigation,
  } = formData;

  const MAXIMUM_DEPENDENT_AGE = 150;

  const [stateDependents, setStateDependents] = useState(dependents);
  const [errors, setErrors] = useState(
    Array(stateDependents.length).fill(null),
  );
  const [isEditing, setIsEditing] = useState(!isReviewMode);
  const [hasDependentsChanged, setHasDependentsChanged] = useState(false);

  // notify user they are returning to review page if they are in review mode
  const continueButtonText =
    reviewNavigation && showReviewNavigation
      ? 'Continue to review page'
      : 'Continue';

  useEffect(
    () => {
      const shouldInitializeDependents =
        !stateDependents.length ||
        stateDependents.length !== parseInt(hasDependents, 10);

      if (shouldInitializeDependents) {
        const addDependents = Array.from(
          { length: parseInt(hasDependents, 10) },
          (_, i) => stateDependents[i] || { dependentAge: '' },
        );
        setStateDependents(addDependents);
        setErrors(Array(addDependents.length).fill(null));
        dispatch(
          setData({
            ...formData,
            personalData: {
              ...formData.personalData,
              dependents: addDependents,
            },
          }),
        );
        if (isReviewMode) {
          setHasDependentsChanged(true);
        } else {
          setHasDependentsChanged(false); // Reset the hasDependentsChanged state variable
        }
      }
    },
    [dispatch, hasDependents, isReviewMode, formData, stateDependents],
  );

  useEffect(
    () => {
      if (isReviewMode) {
        setIsEditing(hasDependentsChanged);
      }
    },
    [isReviewMode, hasDependentsChanged],
  );

  const updateDependents = useCallback(
    (target, i) => {
      const { value } = target;
      const newDependentAges = [...stateDependents];
      newDependentAges[i] = { dependentAge: value };
      setStateDependents(newDependentAges);
      dispatch(
        setData({
          ...formData,
          personalData: {
            ...formData.personalData,
            dependents: newDependentAges,
          },
        }),
      );
    },
    [stateDependents, dispatch, formData],
  );

  const onSubmit = event => {
    const hasEmptyInput = stateDependents.some(
      dependent => dependent.dependentAge === '',
    );

    if (errors.some(error => error !== null) || hasEmptyInput) {
      event.preventDefault(); // Prevent the form from being submitted when there are errors
      if (hasEmptyInput) {
        const newErrors = stateDependents.map(
          (dependent, i) =>
            dependent.dependentAge === ''
              ? 'Please enter your dependent(s) age.'
              : errors[i],
        );
        setErrors(newErrors);
      }

      return null;
    }

    if (isReviewMode) {
      return setIsEditing(false);
    }

    if (reviewNavigation && showReviewNavigation) {
      dispatch(
        setData({
          ...formData,
          reviewNavigation: false,
        }),
      );
      return goToPath('/review-and-submit');
    }

    return formData['view:streamlinedWaiver']
      ? goForward(formData)
      : goToPath('/monetary-asset-checklist');
  };

  const onCancel = event => {
    event.preventDefault();
    goToPath('/dependent-count');
  };

  const handleBlur = useCallback(
    (event, i) => {
      const { value } = event.target;
      const newErrors = [...errors];
      if (!value) {
        newErrors[i] = 'Please enter your dependent(s) age';
      } else if (!isNumber(value)) {
        newErrors[i] = 'Please enter only numerical values';
      } else if (value < 0 || value > MAXIMUM_DEPENDENT_AGE) {
        newErrors[i] = 'Please enter a value between 0 and 150';
      } else {
        newErrors[i] = null;
      }
      setErrors(newErrors);
    },
    [errors],
  );

  const handlers = {
    onSubmit,
    onCancel,
    handleBlur,
    updateDependents,
  };

  // Determine whether to render inputs or plain text based on mode
  const renderAgeInput = (dependent, i) => (
    <div key={`dependentAge-${i}`}>
      <VaNumberInput
        id={`dependentAge-${i}`}
        label={DEPENDENT_AGE_LABELS[i + 1]}
        name={`dependentAge-${i}`}
        onInput={({ target }) => handlers.updateDependents(target, i)}
        value={dependent.dependentAge}
        className="input-size-2 no-wrap"
        onBlur={event => handlers.handleBlur(event, i)}
        error={errors[i]}
        inputMode="numeric"
        required
        min={0}
        max={MAXIMUM_DEPENDENT_AGE}
        uswds
      />
    </div>
  );

  const renderAgeText = (dependent, i) => (
    <div
      key={`dependentAge-${i}`}
      className={`review-row ${i > 0 ? 'vads-u-border-top--1' : ''}`}
    >
      <dt>{DEPENDENT_AGE_LABELS[i + 1]}</dt>
      <dd>{dependent.dependentAge || ''}</dd>
    </div>
  );

  const HeaderTag = isReviewMode && !isEditing ? 'h4' : 'h3';
  const className =
    isReviewMode && !isEditing
      ? 'form-review-panel-page-header vads-u-font-size--h5'
      : 'vads-u-margin--0';

  let dependentAgeInputs = stateDependents.map(
    (dependent, i) =>
      isEditing ? renderAgeInput(dependent, i) : renderAgeText(dependent, i),
  );

  if (!isEditing) {
    dependentAgeInputs = (
      <dl className="review vads-u-border-bottom--1">{dependentAgeInputs}</dl>
    );
  }

  return (
    <form onSubmit={handlers.onSubmit}>
      <fieldset className="vads-u-margin-y--2">
        <legend
          className={`${
            isReviewMode
              ? 'form-review-panel-page-header-row'
              : 'schemaform-block-title'
          }`}
        >
          <HeaderTag className={className}>Dependents ages</HeaderTag>

          {!isReviewMode ? (
            <>
              <p className="vads-u-margin-bottom--neg1 vads-u-margin-top--3 vads-u-font-family--sans vads-u-font-weight--normal vads-u-font-size--base">
                Enter each dependent’s age separately.
              </p>
              <p className="vads-u-margin-bottom--neg1 vads-u-margin-top--1 vads-u-padding-bottom--0p25 vads-u-font-family--sans vads-u-font-weight--normal vads-u-font-size--base vads-u-color--gray-medium">
                Dependents include your spouse, unmarried children under 18
                years old, and other dependents.
              </p>
            </>
          ) : null}
        </legend>
        {dependentAgeInputs}
        {!isReviewMode ? <DependentExplainer /> : null}
        {contentBeforeButtons}
        {isReviewMode && isEditing ? (
          <div className="vads-u-margin-top--2">
            <ReviewControl
              // readOnly
              position="footer"
              isEditing
              type="submit"
              ariaLabel={`Update ${DEPENDENT_AGE_LABELS[1]}`}
              buttonText="Update"
            />
          </div>
        ) : (
          !isReviewMode && (
            <ButtonGroup
              buttons={[
                {
                  label: 'Back',
                  onClick: handlers.onCancel, // Define this function based on page-specific logic
                  isSecondary: true,
                },
                {
                  label: continueButtonText,
                  onClick: handlers.onSubmit,
                  isSubmitting: true, // If this button submits a form
                },
              ]}
            />
          )
        )}
        {contentAfterButtons}
      </fieldset>
    </form>
  );
};

DependentAges.propTypes = {
  contentAfterButtons: PropTypes.object,
  contentBeforeButtons: PropTypes.object,
  goForward: PropTypes.func,
  goToPath: PropTypes.func,
  isReviewMode: PropTypes.bool,
};

export default DependentAges;
