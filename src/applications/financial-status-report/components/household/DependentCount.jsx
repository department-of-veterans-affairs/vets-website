import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { focusElement } from 'platform/utilities/ui';
import { VaNumberInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import DependentExplainer from './DependentExplainer';
import ButtonGroup from '../shared/ButtonGroup';

const WHOLE_NUMBER_PATTERN = /^\d+$/;

const DependentCount = ({
  data,
  goBack,
  goForward,
  setFormData,
  contentBeforeButtons,
  contentAfterButtons,
}) => {
  const headerRef = useRef(null);

  const {
    questions: { hasDependents },
  } = data;

  const [error, setError] = useState(null);
  const [dependents, setDependents] = useState(hasDependents);

  // Header ref for setting focus
  useEffect(
    () => {
      if (headerRef?.current) {
        focusElement(headerRef?.current);
      }
    },
    [headerRef],
  );

  // setData on goForward, nav is handled in onSubmit so goForward has teh most up to date data
  const onGoForward = () => {
    if (!WHOLE_NUMBER_PATTERN.test(dependents)) {
      setError('Please enter your dependent(s) information.');
      focusElement('va-number-input');
    } else {
      setError(null);
      if (dependents === '0') {
        // clear dependent array if it was previously populated
        setFormData({
          ...data,
          questions: {
            ...data?.questions,
            hasDependents: dependents,
          },
          personalData: {
            ...data?.personalData,
            dependents: [],
          },
        });
      } else {
        setFormData({
          ...data,
          questions: {
            ...data?.questions,
            hasDependents: dependents,
          },
        });
      }
    }
  };

  return (
    <form
      onSubmit={event => {
        event.preventDefault();
        if (error) return;
        goForward(data);
      }}
    >
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
              setError('Please enter your dependent(s) information.');
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
        />
        <DependentExplainer />
      </fieldset>
      {contentBeforeButtons}
      <ButtonGroup
        buttons={[
          {
            label: 'Back',
            onClick: goBack,
            secondary: true,
            iconLeft: '«',
          },
          {
            label: 'Continue',
            onClick: onGoForward,
            type: 'submit',
            iconRight: '»',
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
  }).isRequired,
  goBack: PropTypes.func.isRequired,
  goForward: PropTypes.func.isRequired,
  goToPath: PropTypes.func.isRequired,
  setFormData: PropTypes.func.isRequired,
  contentAfterButtons: PropTypes.node,
  contentBeforeButtons: PropTypes.node,
};

export default DependentCount;
