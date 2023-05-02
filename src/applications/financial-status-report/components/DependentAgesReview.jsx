import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { setData } from '@department-of-veterans-affairs/platform-forms-system/actions';
import { VaNumberInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { validateIsNumber } from '../utils/validations';
import { DEPENDENT_AGE_LABELS } from '../constants/dependentLabels';
import ReviewControl from './shared/ReviewControl';

const DependentAgeField = ({
  isEditing,
  index,
  inputValues,
  dependent,
  onAgeChange,
  onBlur,
  error,
}) => (
  <dl
    className={`review ${
      isEditing ? 'vads-u-border-bottom--0 vads-u-border-top--0' : ''
    }`}
    key={`dependentAge-${index}`}
  >
    <div
      className={`review-row ${
        index > 0 || isEditing ? 'vads-u-border-top--0' : ''
      }`}
    >
      {!isEditing ? <dt>{DEPENDENT_AGE_LABELS[index + 1]}</dt> : null}
      <dd>
        {isEditing ? (
          <VaNumberInput
            id={`dependentAge-${index}`}
            label={DEPENDENT_AGE_LABELS[index + 1]}
            name={`dependentAge-${index}`}
            onInput={e => onAgeChange(index, e)}
            value={inputValues[index] || ''}
            className="no-wrap input-size-1"
            onBlur={e => onBlur(index, e)}
            error={error}
            required
          />
        ) : (
          dependent.dependentAge || ''
        )}
      </dd>
    </div>
  </dl>
);

const DependentAgesReview = () => {
  const dispatch = useDispatch();
  const formData = useSelector(state => state.form.data);
  const { questions, personalData } = formData;
  const { hasDependents = 0 } = questions;
  const { dependents = [] } = personalData;
  const [stateDependents, setStateDependents] = useState(dependents);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState(dependents.map(() => null));
  const [inputValues, setInputValues] = useState(
    dependents.map(dependent => dependent.dependentAge || ''),
  );

  useEffect(
    () => {
      const numberOfDependents = parseInt(hasDependents, 10) || 0;
      if (stateDependents.length !== numberOfDependents) {
        const updatedDependents = Array.from(
          { length: numberOfDependents },
          (_, i) => {
            return stateDependents[i] || { dependentAge: '' };
          },
        );
        setStateDependents(updatedDependents);
        setErrors(Array(updatedDependents.length).fill(null));
      }
    },
    [hasDependents, stateDependents],
  );

  useEffect(
    () => {
      setInputValues(dependents.map(dependent => dependent.dependentAge || ''));
    },
    [dependents],
  );

  useEffect(
    () => {
      if (!isEditing) {
        setInputValues(
          dependents.map(dependent => dependent.dependentAge || ''),
        );
      }
    },
    [isEditing, dependents],
  );

  const numberOfDependents = parseInt(hasDependents, 10) || 0;
  if (numberOfDependents === 0) {
    return null;
  }

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleAgeChange = (index, e) => {
    const newInputValues = [...inputValues];
    newInputValues[index] = e.target.value;
    setInputValues(newInputValues);
  };

  const handleBlur = (index, e) => {
    const { value } = e.target;
    const newErrors = [...errors];
    if (!value) {
      newErrors[index] = 'Please enter your dependent(s) age.';
    } else if (!validateIsNumber(value)) {
      newErrors[index] = 'Please enter only numerical values';
    } else {
      newErrors[index] = null;
    }
    setErrors(newErrors);
  };

  const updateDependentAges = () => {
    const updatedDependents = inputValues
      .slice(0, numberOfDependents)
      .map((age, index) => ({
        ...stateDependents[index],
        dependentAge: age,
      }));

    const hasInputValuesChanged = !stateDependents.every(
      (dependent, index) =>
        dependent.dependentAge === updatedDependents[index]?.dependentAge,
    );

    if (hasInputValuesChanged) {
      dispatch(
        setData({
          ...formData,
          personalData: {
            ...personalData,
            dependents: updatedDependents,
          },
        }),
      );
    }
  };

  return (
    <>
      {!isEditing ? (
        <ReviewControl
          title="Your Dependents"
          position="header"
          isEditing={false}
          onEditClick={handleEditClick}
          buttonText="Edit"
          ariaLabel={`Edit ${DEPENDENT_AGE_LABELS[1]}`}
        />
      ) : (
        <h4 className="form-review-panel-page-header vads-u-font-size--h5 vads-u-border-bottom--1">
          Your Dependents
        </h4>
      )}
      {Array.from({ length: numberOfDependents }, (_, i) => {
        const dependent = dependents[i] || {};
        return (
          <DependentAgeField
            key={`dependentAgeField-${i}`}
            isEditing={isEditing}
            index={i}
            inputValues={inputValues}
            dependent={dependent}
            onAgeChange={handleAgeChange}
            onBlur={handleBlur}
            error={errors[i]}
          />
        );
      })}
      {isEditing ? (
        <ReviewControl
          position="footer"
          isEditing
          onUpdateClick={() => {
            updateDependentAges(); // Update the dependent ages in the Redux store
            setIsEditing(false);
          }}
          ariaLabel={`Update ${DEPENDENT_AGE_LABELS[1]}`}
          buttonText="Update Page"
        />
      ) : null}
    </>
  );
};

// PropTypes for DependentAgeField component
DependentAgeField.propTypes = {
  dependent: PropTypes.shape({
    dependentAge: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }).isRequired,
  index: PropTypes.number.isRequired,
  inputValues: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  ).isRequired,
  isEditing: PropTypes.bool.isRequired,
  onAgeChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  error: PropTypes.string,
};

export default DependentAgesReview;
