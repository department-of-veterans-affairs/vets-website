import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { VaTextInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { setData } from 'platform/forms-system/src/js/actions';
import { DEPENDENT_AGE_LABELS } from '../../constants/dependentLabels';
import { isNumber } from '../../utils/helpers';
import DependentExplainer from './DependentExplainer';
import ButtonGroup from '../shared/ButtonGroup';

const DependentAges = ({
  contentBeforeButtons,
  contentAfterButtons,
  setFormData,
  goForward,
  goToPath,
  goBack,
}) => {
  const dispatch = useDispatch();
  const formData = useSelector(state => state.form.data);
  const {
    questions: { hasDependents } = {},
    personalData: { dependents = [] } = {},
  } = formData;

  const MAXIMUM_DEPENDENT_AGE = 150;

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
    [dispatch, hasDependents, formData, stateDependents],
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

  const validateForm = () => {
    const hasEmptyInput = stateDependents.some(
      dependent => dependent.dependentAge === '',
    );

    if (errors.some(error => error !== null) || hasEmptyInput) {
      if (hasEmptyInput) {
        const newErrors = stateDependents.map(
          (dependent, i) =>
            dependent.dependentAge === ''
              ? 'Please enter your dependent(s) age.'
              : errors[i],
        );
        setErrors(newErrors);
      }
      return false;
    }
    return true;
  };

  const onSubmit = event => {
    event.preventDefault();
    if (validateForm()) {
      if (formData['view:streamlinedWaiver']) {
        goForward(formData);
      } else {
        goToPath('/monetary-asset-checklist');
      }
    }
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

  const handleGoBack = event => {
    event.preventDefault();
    // Only save the hasDependents value when going back
    const updatedFormData = {
      ...formData,
      questions: {
        ...formData.questions,
        hasDependents: formData.questions.hasDependents,
      },
    };
    setFormData(updatedFormData);
    goBack();
  };

  const handlers = {
    onSubmit,
    handleBlur,
    updateDependents,
    handleGoBack,
  };

  const renderAgeInput = (dependent, i) => (
    <div key={`dependentAge-${i}`}>
      <VaTextInput
        id={`dependentAge-${i}`}
        label={DEPENDENT_AGE_LABELS[i + 1]}
        name={`dependentAge-${i}`}
        onInput={({ target }) => handlers.updateDependents(target, i)}
        value={dependent.dependentAge}
        width="md"
        onBlur={event => handlers.handleBlur(event, i)}
        error={errors[i]}
        inputmode="numeric"
        required
        min={0}
        max={MAXIMUM_DEPENDENT_AGE}
      />
    </div>
  );

  const dependentAgeInputs = stateDependents.map((dependent, i) =>
    renderAgeInput(dependent, i),
  );

  return (
    <form onSubmit={handlers.onSubmit}>
      <fieldset className="vads-u-margin-y--2">
        <legend className="schemaform-block-title">
          <h3 className="vads-u-margin--0">Dependents ages</h3>
          <p className="vads-u-margin-bottom--neg1 vads-u-margin-top--3 vads-u-font-family--sans vads-u-font-weight--normal vads-u-font-size--base">
            Enter each dependent’s age separately.
          </p>
          <p className="vads-u-margin-bottom--neg1 vads-u-margin-top--1 vads-u-padding-bottom--0p25 vads-u-font-family--sans vads-u-font-weight--normal vads-u-font-size--base vads-u-color--gray-medium">
            Dependents include your spouse, unmarried children under 18 years
            old, and other dependents.
          </p>
        </legend>
        {dependentAgeInputs}
        <DependentExplainer />
        {contentBeforeButtons}
        <ButtonGroup
          buttons={[
            {
              label: 'Back',
              onClick: handlers.handleGoBack,
              isSecondary: true,
              isSubmitting: 'prevent',
            },
            {
              label: 'Continue',
              onClick: handlers.onSubmit,
              isSubmitting: 'prevent',
            },
          ]}
        />
        {contentAfterButtons}
      </fieldset>
    </form>
  );
};

DependentAges.propTypes = {
  contentAfterButtons: PropTypes.object,
  contentBeforeButtons: PropTypes.object,
  goBack: PropTypes.func,
  goForward: PropTypes.func,
  goToPath: PropTypes.func,
};

export default DependentAges;
