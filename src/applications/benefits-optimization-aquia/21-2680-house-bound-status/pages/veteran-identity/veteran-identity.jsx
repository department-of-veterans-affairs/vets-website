import PropTypes from 'prop-types';
import React from 'react';

import {
  MemorableDateField,
  SSNField,
  TextInputField,
} from '@bio-aquia/shared/components/atoms';
import { FullnameField } from '@bio-aquia/shared/components/molecules';
import { PageTemplate } from '@bio-aquia/shared/components/templates';
import { transformDates } from '@bio-aquia/shared/forms';

import {
  veteranSSNSchema,
  veteranFileNumberSchema,
  veteranServiceNumberSchema,
  veteranDOBSchema,
  veteranIdentificationSchema,
} from '@bio-aquia/21-2680-house-bound-status/schemas';

/**
 * Data processor to ensure date values are properly formatted strings
 */
const ensureDateStrings = formData => {
  return transformDates(formData, ['veteranDOB']);
};

/**
 * Veteran Identity Page
 * Section I - Items 1-5: Veteran identification information
 * @module pages/veteran-identity
 */
export const VeteranIdentityPage = ({
  data,
  setFormData,
  goForward,
  goBack,
  onReviewPage,
  updatePage,
}) => {
  const formDataToUse =
    data && typeof data === 'object' && !Array.isArray(data) ? data : {};

  return (
    <PageTemplate
      title="Veteran information"
      data={formDataToUse}
      setFormData={setFormData}
      goForward={goForward}
      goBack={goBack}
      schema={veteranIdentificationSchema}
      sectionName="veteranIdentification"
      dataProcessor={ensureDateStrings}
      onReviewPage={onReviewPage}
      updatePage={updatePage}
      defaultData={{
        veteranFirstName: '',
        veteranMiddleName: '',
        veteranLastName: '',
        veteranSSN: '',
        veteranFileNumber: '',
        veteranServiceNumber: '',
        veteranDOB: '',
        isVeteranClaimant: '',
      }}
    >
      {({ localData, handleFieldChange, errors, formSubmitted }) => (
        <>
          <p>Enter the Veteran’s identification information.</p>

          <FullnameField
            value={{
              first: localData.veteranFirstName || '',
              middle: localData.veteranMiddleName || '',
              last: localData.veteranLastName || '',
            }}
            onChange={(_, nameValue) => {
              handleFieldChange('veteranFirstName', nameValue.first);
              handleFieldChange('veteranMiddleName', nameValue.middle);
              handleFieldChange('veteranLastName', nameValue.last);
            }}
            errors={{
              first: errors.veteranFirstName,
              middle: errors.veteranMiddleName,
              last: errors.veteranLastName,
            }}
            forceShowError={formSubmitted}
            required
            legend="Veteran's full name"
            showSuffix={false}
          />

          <SSNField
            label="Social Security number"
            name="veteranSSN"
            value={localData.veteranSSN || ''}
            onChange={handleFieldChange}
            error={errors.veteranSSN}
            forceShowError={formSubmitted}
            required
            schema={veteranSSNSchema}
          />

          <TextInputField
            label="VA file number (if applicable)"
            name="veteranFileNumber"
            value={localData.veteranFileNumber || ''}
            onChange={handleFieldChange}
            error={errors.veteranFileNumber}
            forceShowError={formSubmitted}
            hint="Leave blank if same as SSN or unknown"
            schema={veteranFileNumberSchema}
          />

          <TextInputField
            label="Service number (if applicable)"
            name="veteranServiceNumber"
            value={localData.veteranServiceNumber || ''}
            onChange={handleFieldChange}
            error={errors.veteranServiceNumber}
            forceShowError={formSubmitted}
            hint="Military service number if different from SSN"
            schema={veteranServiceNumberSchema}
          />

          <MemorableDateField
            label="Date of birth"
            name="veteranDOB"
            value={localData.veteranDOB || ''}
            onChange={handleFieldChange}
            error={errors.veteranDOB}
            forceShowError={formSubmitted}
            required
            schema={veteranDOBSchema}
          />

          <va-radio
            label="Are you the Veteran?"
            name="isVeteranClaimant"
            value={localData.isVeteranClaimant || ''}
            onVaValueChange={e =>
              handleFieldChange('isVeteranClaimant', e.detail.value)
            }
            error={errors.isVeteranClaimant}
            required
          >
            <va-radio-option label="Yes, I am the Veteran" value="yes" />
            <va-radio-option
              label="No, I am filing for the Veteran"
              value="no"
            />
          </va-radio>
        </>
      )}
    </PageTemplate>
  );
};

VeteranIdentityPage.propTypes = {
  goForward: PropTypes.func.isRequired,
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  onReviewPage: PropTypes.bool,
  goBack: PropTypes.func,
  setFormData: PropTypes.func,
  updatePage: PropTypes.func,
};
