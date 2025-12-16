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

import { waitForRenderThenFocus } from 'platform/utilities/ui';

const EMPLOYERS_PATH = 'employers';
const SECTION_TWO_KEYS = [
  employedByVAFields.hasCertifiedSection2,
  employedByVAFields.hasUnderstoodSection2,
  employedByVAFields.employerName,
  employedByVAFields.employerAddress,
  employedByVAFields.typeOfWork,
  employedByVAFields.hoursPerWeek,
  employedByVAFields.datesOfEmployment,
  employedByVAFields.lostTime,
  employedByVAFields.highestIncome,
  employedByVAFields.isEmployedByVA,
];
const SECTION_THREE_KEYS = [
  employedByVAFields.hasCertifiedSection3,
  employedByVAFields.hasUnderstoodSection3,
];

const LEGACY_SELECTION_MAP = {
  Y: 'yes',
  N: 'no',
};

const pruneNestedObject = (object, keysToRemove) => {
  if (!object) {
    return undefined;
  }

  const next = { ...object };
  let changed = false;

  keysToRemove.forEach(key => {
    if (Object.prototype.hasOwnProperty.call(next, key)) {
      delete next[key];
      changed = true;
    }
  });

  if (!changed) {
    return object;
  }

  if (Object.keys(next).length === 0) {
    return undefined;
  }

  return next;
};

const clearEmploymentFlowData = formData => {
  if (!formData) {
    return formData;
  }

  const updated = { ...formData };

  if (Object.prototype.hasOwnProperty.call(updated, EMPLOYERS_PATH)) {
    delete updated[EMPLOYERS_PATH];
  }

  const cleanedEmployedByVA = pruneNestedObject(
    updated[employedByVAFields.parentObject],
    SECTION_TWO_KEYS,
  );

  if (cleanedEmployedByVA === undefined) {
    delete updated[employedByVAFields.parentObject];
  } else if (cleanedEmployedByVA !== updated[employedByVAFields.parentObject]) {
    updated[employedByVAFields.parentObject] = cleanedEmployedByVA;
  }

  return updated;
};

const clearUnemploymentFlowData = formData => {
  if (!formData) {
    return formData;
  }

  const updated = { ...formData };

  const cleanedEmployedByVA = pruneNestedObject(
    updated[employedByVAFields.parentObject],
    SECTION_THREE_KEYS,
  );

  if (cleanedEmployedByVA === undefined) {
    delete updated[employedByVAFields.parentObject];
  } else if (cleanedEmployedByVA !== updated[employedByVAFields.parentObject]) {
    updated[employedByVAFields.parentObject] = cleanedEmployedByVA;
  }

  return updated;
};

const applySelectionToFormData = (formData, selection) => {
  if (!selection) {
    return formData;
  }

  const employmentCheckData =
    formData?.[employmentCheckFields.parentObject] || {};

  let updated = {
    ...formData,
    [employmentCheckFields.parentObject]: {
      ...employmentCheckData,
      [employmentCheckFields.hasEmploymentInLast12Months]: selection,
    },
  };

  if (selection === 'yes') {
    updated = clearUnemploymentFlowData(updated);
  } else if (selection === 'no') {
    updated = clearEmploymentFlowData(updated);
  }

  return updated;
};

const EmploymentCheckPage = ({
  data,
  setFormData,
  goBack,
  goForward,
  NavButtons,
}) => {
  useEffect(() => {
    scrollTo('topScrollElement');
    waitForRenderThenFocus('#main-content');
  }, []);

  const formData = data || {};
  const employmentCheckData =
    formData?.[employmentCheckFields.parentObject] || {};
  const storedSelection =
    employmentCheckData?.[employmentCheckFields.hasEmploymentInLast12Months];
  const legacySelection =
    formData?.[employedByVAFields.parentObject]?.[
      employedByVAFields.isEmployedByVA
    ];
  const legacyNormalized = LEGACY_SELECTION_MAP[legacySelection];
  const selection = storedSelection || legacyNormalized;

  const [selectionState, setSelectionState] = useState(selection);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  useEffect(
    () => {
      setSelectionState(selection);
    },
    [selection],
  );

  useEffect(
    () => {
      if (!storedSelection && legacyNormalized) {
        setFormData({
          ...formData,
          [employmentCheckFields.parentObject]: {
            ...employmentCheckData,
            [employmentCheckFields.hasEmploymentInLast12Months]: legacyNormalized,
          },
        });
      }
    },
    [
      storedSelection,
      legacyNormalized,
      employmentCheckData,
      formData,
      setFormData,
    ],
  );

  const handleContinue = event => {
    event?.preventDefault();

    const currentSelection = selectionState || selection;

    if (!currentSelection) {
      setAttemptedSubmit(true);
      return;
    }

    const updatedFormData = applySelectionToFormData(
      formData,
      currentSelection,
    );

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

    const updatedFormData = applySelectionToFormData(formData, value);

    setFormData(updatedFormData);
  };

  const handleBlur = event => {
    const { currentTarget } = event || {};
    if (!currentTarget) {
      return;
    }

    // Defer until after focus settles so we can detect moves within the radio group
    setTimeout(() => {
      const activeElement = document.activeElement;
      if (
        activeElement === currentTarget ||
        currentTarget.contains(activeElement)
      ) {
        return;
      }

      if (!selectionState) {
        setAttemptedSubmit(true);
      }
    }, 0);
  };

  return (
    <div className="schemaform-intro">
      <h1 className="vads-u-margin-bottom--2" id="main-content">
        Were you employed or self-employed at any time in the past 12 months? 
      </h1>
      <p className="vads-u-margin-bottom--3" style={{ fontSize: '16px' }}>
        You’ll need to add at least 1 employer. You can add up to 4.
      </p>
      <VaRadio
        name="employment-check"
        label=""
        required
        value={selectionState ?? ''}
        error={
          attemptedSubmit && !selectionState
            ? 'Please select whether you were employed during the past 12 months.'
            : undefined
        }
        onVaValueChange={handleValueChange}
        onBlur={handleBlur}
        className="vads-u-margin-bottom--3"
        uswds
      >
        <VaRadioOption
          name="employment-check"
          label="Yes, I have employment to report"
          value="yes"
        />
        <VaRadioOption
          name="employment-check"
          label="No, I don't have any employment to report"
          value="no"
        />
      </VaRadio>
    
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
