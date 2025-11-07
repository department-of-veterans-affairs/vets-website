import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { scrollTo } from 'platform/utilities/scroll';
import {
  VaAlert,
  VaRadio,
  VaRadioOption,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { waitForRenderThenFocus } from 'platform/utilities/ui';
import {
  employmentCheckFields,
  employedByVAFields,
} from '../definitions/constants';

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
      const { activeElement } = document;
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
      <h3 className="vads-u-margin-bottom--2" id="main-content">
        Employment in the past 12 months
      </h3>
      <p className="vads-u-margin-bottom--3" style={{ fontSize: '16px' }}>
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
        className="vads-u-margin-bottom--3"
        uswds
      >
        <VaRadioOption
          name="employment-check"
          label="Yes, I was employed or self-employed during the past 12 months"
          value="yes"
        />
        <VaRadioOption
          name="employment-check"
          label="No, I was not employed during the past 12 months"
          value="no"
        />
      </VaRadio>
      <VaAlert
        id="required-information-summary"
        status="info"
        uswds
        className="vads-u-margin-bottom--3"
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
