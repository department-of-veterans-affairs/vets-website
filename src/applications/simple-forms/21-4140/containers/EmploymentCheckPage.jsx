import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { scrollTo } from 'platform/utilities/scroll';
import {
  VaAlert,
  VaRadio,
  VaRadioOption,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import {
  employmentCheckFields,
  employedByVAFields,
} from '../definitions/constants';
import { skipToContent } from '../utils/skipToContent';

const EmploymentCheckPage = ({
  data,
  setFormData,
  goBack,
  goForward,
  NavButtons,
}) => {
  useEffect(() => {
    scrollTo('topScrollElement');
  }, []);

  const formData = data || {};
  const employmentCheckData =
    formData?.[employmentCheckFields.parentObject] || {};
  const storedSelection =
    employmentCheckData?.[
      employmentCheckFields.hasEmploymentInLast12Months
    ];
  const legacySelection =
    formData?.[employedByVAFields.parentObject]?.[
      employedByVAFields.isEmployedByVA
    ];
  const legacyNormalized =
    legacySelection === 'Y'
      ? 'yes'
      : legacySelection === 'N'
        ? 'no'
        : undefined;
  const selection = storedSelection || legacyNormalized;

  const [selectionState, setSelectionState] = useState(selection);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  useEffect(() => {
    setSelectionState(selection);
  }, [selection]);

  useEffect(() => {
    if (!storedSelection && legacyNormalized) {
      setFormData({
        ...formData,
        [employmentCheckFields.parentObject]: {
          ...employmentCheckData,
          [employmentCheckFields.hasEmploymentInLast12Months]: legacyNormalized,
        },
      });
    }
  }, [
    storedSelection,
    legacyNormalized,
    employmentCheckData,
    formData,
    setFormData,
  ]);

  const handleContinue = event => {
    event?.preventDefault();
    setAttemptedSubmit(true);

    const currentSelection = selectionState || selection;

    if (!currentSelection) {
      return;
    }

    const updatedFormData = {
      ...formData,
      [employmentCheckFields.parentObject]: {
        ...employmentCheckData,
        [employmentCheckFields.hasEmploymentInLast12Months]: currentSelection,
      },
    };

    setFormData(updatedFormData);
    goForward({ formData: updatedFormData });
  };

  const handleValueChange = ({ detail } = {}) => {
    const value = detail?.value;
    setAttemptedSubmit(false);

    if (!value) {
      setSelectionState(undefined);
      return;
    }

    setSelectionState(value);

    setFormData({
      ...formData,
      [employmentCheckFields.parentObject]: {
        ...employmentCheckData,
        [employmentCheckFields.hasEmploymentInLast12Months]: value,
      },
    });
  };

  const handleBlur = event => {
    const { currentTarget } = event || {};
    if (!currentTarget) {
      return;
    }

    // Defer until after focus settles so we can detect moves within the radio group
    setTimeout(() => {
      const activeElement = document.activeElement;
      if (activeElement === currentTarget || currentTarget.contains(activeElement)) {
        return;
      }

      if (!selectionState) {
        setAttemptedSubmit(true);
      }
    }, 0);
  };

  return (
    <div className="schemaform-intro">
      <a className="show-on-focus" href="#main-content" onClick={skipToContent}>Skip to Content</a>
      <h1 id="main-content" className="vads-u-margin-bottom--2">Employment in the past 12 months</h1>
      <p className="vads-u-margin-bottom--3" style={{ fontSize: '20px' }}>
        This includes any work for VA, other employers, or self-employment.
      </p>
      <VaRadio
        name="employment-check"
        label="Were you employed or self-employed at any time during the past 12  months?"
        required
        value={selectionState ?? ''}
        error={
          attemptedSubmit && !selectionState
            ? 'Please select whether you were employed during the past 12 months.'
            : undefined
        }
        onVaValueChange={handleValueChange}
        onBlur={handleBlur}
        uswds
      >
        <VaRadioOption
          label="Yes, I was employed or self-employed during the past 12 months"
          value="yes"
        />
        <VaRadioOption
          label="No, I was not employed during the past 12 months"
          value="no"
        />
      </VaRadio>
      <VaAlert
        id="required-information-summary"
        status="info"
        uswds
        class="vads-u-margin-bottom--3"
        visible
      >
        <h2 slot="headline">What counts as employment?</h2>
        <p>This includes:</p>
        <ul className="usa-list vads-u-margin--0">
          <li>Full time or part time work</li>
          <li>Self-employment or contract work</li>
        </ul>
      </VaAlert>
      <NavButtons goBack={goBack} goForward={handleContinue} submitToContinue />
    </div>
  );
};

EmploymentCheckPage.propTypes = {
  data: PropTypes.object,
  setFormData: PropTypes.func,
  goBack: PropTypes.func,
  goForward: PropTypes.func,
  NavButtons: PropTypes.elementType,
};

export default EmploymentCheckPage;
