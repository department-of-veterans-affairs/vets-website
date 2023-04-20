import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { VaNumberInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { setData } from 'platform/forms-system/src/js/actions';
import { DEPENDENT_AGE_LABELS } from '../constants/dependentLabels';
import { validateIsNumber } from '../utils/validations';

const DependentAges = () => {
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
      }
    },
    [stateDependents, dispatch, formData, hasDependents],
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

  const dependentAgeInputs = useMemo(
    () =>
      stateDependents.map((dependent, i) => (
        <div key={`dependentAge-${i}`} className="vads-u-margin-bottom--2">
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
        </div>
      )),
    [stateDependents, handleBlur, errors, updateDependents],
  );
  return <>{dependentAgeInputs}</>;
};

export default DependentAges;
