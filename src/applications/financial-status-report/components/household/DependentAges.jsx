import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { VaNumberInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { setData } from 'platform/forms-system/src/js/actions';
import { DEPENDENT_AGE_LABELS } from '../../constants/dependentLabels';
import { validateIsNumber } from '../../utils/validations';
import ButtonGroup from '../shared/ButtonGroup';
import ReviewControl from '../shared/ReviewControl';

const DependentAges = ({ goForward, goToPath, isReviewMode = false }) => {
  const dispatch = useDispatch();
  const formData = useSelector(state => state.form.data);
  const {
    questions: { hasDependents } = {},
    personalData: { dependents = [] } = {},
  } = formData;

  const [stateDependents, setStateDependents] = useState(dependents);
  const [errors, setErrors] = useState(
    Array(stateDependents.length).fill(null),
  );
  const [isEditing, setIsEditing] = useState(!isReviewMode);
  const [hasDependentsChanged, setHasDependentsChanged] = useState(false);

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
    event.preventDefault();
    const hasEmptyInput = stateDependents.some(
      dependent => dependent.dependentAge === '',
    );
    if (hasEmptyInput) {
      const newErrors = stateDependents.map(
        (dependent, i) =>
          dependent.dependentAge === ''
            ? 'Please enter your dependent(s) age.'
            : errors[i],
      );
      return setErrors(newErrors);
    }
    if (isReviewMode) {
      return setIsEditing(false);
    }
    return formData['view:streamlinedWaiver']
      ? goForward(formData)
      : goToPath('/monetary-asset-checklist');
  };

  const onCancel = event => {
    event.preventDefault();
    goToPath('/dependent-count');
  };

  const toggleEditing = () => {
    setIsEditing(!isEditing);
  };

  const handleBlur = useCallback(
    (event, i) => {
      const { value } = event.target;
      const newErrors = [...errors];
      if (!value) {
        newErrors[i] = 'Please enter your dependent(s) age.';
      } else if (!validateIsNumber(value)) {
        newErrors[i] = 'Please enter only numerical values';
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
    toggleEditing,
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
        required
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
      : 'schemablock-title vads-u-margin-top--5';
  const text =
    isReviewMode && !isEditing ? 'Review Dependants ages' : 'Dependents ages';

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
      <div
        className={`${isReviewMode ? 'form-review-panel-page-header-row' : ''}`}
      >
        <HeaderTag className={className}>{text}</HeaderTag>
        {isReviewMode &&
          !isEditing && (
            <ReviewControl
              // readOnly
              position="header"
              isEditing={false}
              onEditClick={handlers.toggleEditing}
              ariaLabel={`Edit ${DEPENDENT_AGE_LABELS[1]}`}
              buttonText="Edit"
            />
          )}
      </div>
      {!isReviewMode ? (
        <p className="vads-u-padding-top--2">
          Enter each dependent’s age separately.
        </p>
      ) : null}
      {dependentAgeInputs}
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
                onClick: handlers.onCancel,
                secondary: true,
                iconLeft: '«',
              },
              {
                label: 'Continue',
                type: 'submit',
                iconRight: '»',
              },
            ]}
          />
        )
      )}
    </form>
  );
};

DependentAges.propTypes = {
  goForward: PropTypes.func,
  goToPath: PropTypes.func,
  isReviewMode: PropTypes.bool,
};

export default DependentAges;
