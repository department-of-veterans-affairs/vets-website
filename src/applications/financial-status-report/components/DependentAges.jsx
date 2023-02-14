import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { VaTextInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { setData } from 'platform/forms-system/src/js/actions';
import { DEPENDENT_AGE_LABELS } from '../constants/dependentLabels';

const DependentAges = () => {
  const dispatch = useDispatch();
  const formData = useSelector(state => state.form.data);
  const {
    questions: { hasDependents } = {},
    personalData: { dependents = [] } = {},
  } = formData;

  const [stateDependents, setStateDependents] = useState(dependents);

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

  const dependentAgeInputs = useMemo(
    () =>
      stateDependents.map((dependent, i) => (
        <div key={`dependentAge-${i}`} className="vads-u-margin-bottom--2">
          <VaTextInput
            label={DEPENDENT_AGE_LABELS[i + 1] || `${i + 1}th Dependent's age`}
            name={`dependentAge-${i}`}
            onInput={({ target }) => updateDependents(target, i)}
            value={dependent.dependentAge}
            className="input-size-6"
            required
          />
        </div>
      )),
    [stateDependents, updateDependents],
  );
  return <>{dependentAgeInputs}</>;
};

export default DependentAges;
