import React, { useState, useEffect, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { VaNumberInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { setData } from '@department-of-veterans-affairs/platform-forms-system/actions';
import { DEPENDENT_AGE_LABELS } from '../constants/dependentLabels';
import { validateIsNumber } from '../utils/validations';
import ButtonGroup from './shared/ButtonGroup';
import ReviewControl from './shared/ReviewControl';

const DependentAges = ({ goToPath, isReviewMode = false }) => {
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

  const handlers = {
    onSubmit: event => {
      event.preventDefault();
      if (!errors.some(error => error !== null)) {
        if (isReviewMode) {
          setIsEditing(false);
        } else {
          goToPath('/monetary-asset-checklist');
        }
      }
    },
    onCancel: event => {
      event.preventDefault();
      goToPath('/dependent-count');
    },
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

  // Toggle between review and editing mode
  const toggleEditing = () => {
    setIsEditing(!isEditing);
  };

  // Determine whether to render inputs or plain text based on mode
  const dependentAgeInputs = useMemo(
    () =>
      stateDependents.map((dependent, i) => (
        <div key={`dependentAge-${i}`} className="vads-u-margin-bottom--1">
          {isEditing ? (
            <VaNumberInput
              id={`dependentAge-${i}`}
              label={DEPENDENT_AGE_LABELS[i + 1]}
              name={`dependentAge-${i}`}
              onInput={({ target }) => updateDependents(target, i)}
              value={dependent.dependentAge}
              className="no-wrap input-size-1"
              onBlur={event => handleBlur(event, i)}
              error={errors[i]}
              required
            />
          ) : (
            <>
              <dl
                className={`review vads-u-border-bottom--1 ${
                  isEditing ? 'vads-u-border--0' : ''
                }`}
                key={`dependentAge-${i}`}
              >
                <div
                  className={`review-row ${
                    isEditing ? 'vads-u-padding--0' : ''
                  } ${
                    i > 0 ? 'vads-u-border-top--0 vads-u-margin-top--2 ' : ''
                  }`}
                >
                  <dt>{DEPENDENT_AGE_LABELS[i + 1]}</dt>
                  <dd>{dependent.dependentAge || ''}</dd>
                </div>
              </dl>
            </>
          )}
        </div>
      )),
    [stateDependents, handleBlur, errors, updateDependents, isEditing],
  );

  return (
    <form onSubmit={handlers.onSubmit}>
      <div
        className={`${isReviewMode ? 'form-review-panel-page-header-row' : ''}`}
      >
        <h4
          className={`${
            isReviewMode
              ? 'form-review-panel-page-header vads-u-font-size--h5'
              : ''
          }`}
        >
          Your dependents
        </h4>
        {isReviewMode &&
          !isEditing && (
            <ReviewControl
              readOnly
              position="header"
              isEditing={false}
              onEditClick={toggleEditing}
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
        <ReviewControl
          readOnly
          position="footer"
          isEditing
          type="submit"
          ariaLabel={`Update ${DEPENDENT_AGE_LABELS[1]}`}
          buttonText="Update"
        />
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
  goToPath: PropTypes.func.isRequired,
  isReviewMode: PropTypes.bool.isRequired,
};

export default DependentAges;
