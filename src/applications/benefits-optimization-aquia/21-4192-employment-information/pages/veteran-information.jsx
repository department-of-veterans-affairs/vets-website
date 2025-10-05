<<<<<<< HEAD
import PropTypes from 'prop-types';
import React from 'react';

import {
  MemorableDateField,
  NumberField,
  SSNField,
} from '@bio-aquia/shared/components/atoms';
import { FullnameField } from '@bio-aquia/shared/components/molecules';
import { PageTemplate } from '@bio-aquia/shared/components/templates';
import { transformDates } from '@bio-aquia/shared/forms';

import {
  dateOfBirthSchema,
  ssnSchema,
  vaFileNumberSchema,
  veteranInformationSchema,
} from '../schemas';

/**
 * Data processor to ensure date values are properly formatted strings
 */
const ensureDateStrings = formData => {
  return transformDates(formData, ['dateOfBirth']);
};

/**
 * Veteran Information page component for the employment information form
 * This page collects veteran's personal identification information
 * @param {Object} props - Component props
 * @param {Object} props.data - Initial form data
 * @param {Function} props.setFormData - Function to update form data
 * @param {Function} props.goForward - Function to proceed to next page
 * @param {Function} props.goBack - Function to go to previous page
 * @param {boolean} props.onReviewPage - Whether page is being edited from review
 * @param {Function} props.updatePage - Callback to exit edit mode
 * @returns {JSX.Element} Veteran information form page
 */
export const VeteranInformationPage = ({
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
      title="Veteran's information"
      data={formDataToUse}
      setFormData={setFormData}
      goForward={goForward}
      goBack={goBack}
      schema={veteranInformationSchema}
      sectionName="veteranInformation"
      dataProcessor={ensureDateStrings}
      onReviewPage={onReviewPage}
      updatePage={updatePage}
      defaultData={{
        fullName: {
          first: '',
          middle: '',
          last: '',
        },
        dateOfBirth: '',
        ssn: '',
        vaFileNumber: '',
      }}
    >
      {({ localData, handleFieldChange, errors, formSubmitted }) => (
        <>
          <FullnameField
            name="fullName"
            value={localData.fullName}
            onChange={handleFieldChange}
            errors={errors.fullName || {}}
            forceShowError={formSubmitted}
            label="Veteran's name"
            required
          />

          <MemorableDateField
            name="dateOfBirth"
            label="Date of birth"
            schema={dateOfBirthSchema}
            value={localData.dateOfBirth}
            onChange={handleFieldChange}
            required
            error={errors.dateOfBirth}
            forceShowError={formSubmitted}
          />

          <SSNField
            name="ssn"
            label="Social security number"
            schema={ssnSchema}
            value={localData.ssn}
            onChange={handleFieldChange}
            required
            error={errors.ssn}
            forceShowError={formSubmitted}
          />

          <NumberField
            name="vaFileNumber"
            label="VA file number (if applicable)"
            value={localData.vaFileNumber}
            onChange={handleFieldChange}
            error={errors.vaFileNumber}
            forceShowError={formSubmitted}
            schema={vaFileNumberSchema}
            hint="VA file number must be 8 or 9 digits"
            inputmode="numeric"
          />
        </>
      )}
    </PageTemplate>
=======
import React from 'react';
import PropTypes from 'prop-types';
import { useFormSection } from '@bio-aquia/shared/hooks';

/**
 * Veteran Information Page
 * Section I - Collects veteran's personal identification information
 * @module pages/veteran-information
 */
const VeteranInformationPage = ({ data, goBack, goForward, updatePage }) => {
  const { localData, handleFieldChange, handleSubmit, errors } = useFormSection(
    {
      initialData: data,
      // schema: veteranInformationSchema, // Will be imported when schema is created
      onSubmit: updateData => {
        updatePage(updateData);
        goForward();
      },
    },
  );

  return (
    <form onSubmit={handleSubmit}>
      <fieldset className="vads-u-margin-y--2">
        <legend className="schemaform-block-title">
          <h3 className="vads-u-margin--0">Veteran information</h3>
        </legend>

        <p>
          Enter the information for the Veteran whose employment is being
          verified.
        </p>

        {/* Full name will be added here */}
        <va-text-input
          label="First name"
          name="firstName"
          value={localData.firstName || ''}
          onInput={e => handleFieldChange('firstName', e.target.value)}
          error={errors.firstName}
          required
        />

        <va-text-input
          label="Middle name"
          name="middleName"
          value={localData.middleName || ''}
          onInput={e => handleFieldChange('middleName', e.target.value)}
          error={errors.middleName}
        />

        <va-text-input
          label="Last name"
          name="lastName"
          value={localData.lastName || ''}
          onInput={e => handleFieldChange('lastName', e.target.value)}
          error={errors.lastName}
          required
        />

        {/* SSN field */}
        <va-text-input
          label="Social Security number"
          name="ssn"
          value={localData.ssn || ''}
          onInput={e => handleFieldChange('ssn', e.target.value)}
          error={errors.ssn}
          required
          hint="Enter the Veteran's 9-digit Social Security number"
        />

        {/* VA file number */}
        <va-text-input
          label="VA file number (if applicable)"
          name="vaFileNumber"
          value={localData.vaFileNumber || ''}
          onInput={e => handleFieldChange('vaFileNumber', e.target.value)}
          error={errors.vaFileNumber}
          hint="If the Veteran has a VA file number different from their SSN"
        />

        {/* Date of birth */}
        <va-memorable-date
          label="Date of birth"
          name="dateOfBirth"
          monthSelect
          value={localData.dateOfBirth || ''}
          onDateChange={e => handleFieldChange('dateOfBirth', e.target.value)}
          onDateBlur={() => {}}
          error={errors.dateOfBirth}
          required
        />
      </fieldset>

      <div className="vads-u-margin-top--4">
        <va-button back onClick={goBack}>
          Back
        </va-button>
        <va-button continue type="submit">
          Continue
        </va-button>
      </div>
    </form>
>>>>>>> 33c4dc25a0 (feat(bio-aquia): Setup page patterns for bio-aquia apps)
  );
};

VeteranInformationPage.propTypes = {
<<<<<<< HEAD
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  onReviewPage: PropTypes.bool,
  goBack: PropTypes.func,
  goForward: PropTypes.func.isRequired,
  setFormData: PropTypes.func,
  updatePage: PropTypes.func,
=======
  goBack: PropTypes.func.isRequired,
  goForward: PropTypes.func.isRequired,
  updatePage: PropTypes.func.isRequired,
  data: PropTypes.object,
>>>>>>> 33c4dc25a0 (feat(bio-aquia): Setup page patterns for bio-aquia apps)
};

export default VeteranInformationPage;
