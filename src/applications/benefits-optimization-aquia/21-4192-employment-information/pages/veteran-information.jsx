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
  );
};

VeteranInformationPage.propTypes = {
  goBack: PropTypes.func.isRequired,
  goForward: PropTypes.func.isRequired,
  updatePage: PropTypes.func.isRequired,
  data: PropTypes.object,
};

export default VeteranInformationPage;
