import PropTypes from 'prop-types';
import React from 'react';

import { PageTemplate } from '@bio-aquia/shared/components/templates';
import {
  PhoneField,
  SelectField,
  TextInputField,
} from '@bio-aquia/shared/components/atoms';
import { AddressField } from '@bio-aquia/shared/components/molecules';
import {
  examinerNameSchema,
  examinerTitleSchema,
  examinerNPISchema,
  examinerPhoneSchema,
  facilityPracticeNameSchema,
  examinerIdentificationSchema,
} from '@bio-aquia/21-2680-house-bound-status/schemas';

/**
 * Examiner Identification Page
 * Section VI Part A - Items 16-19: Examiner details
 * @module pages/examiner-identification
 */
export const ExaminerIdentificationPage = ({
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
      title="Medical examiner information"
      data={formDataToUse}
      setFormData={setFormData}
      goForward={goForward}
      goBack={goBack}
      schema={examinerIdentificationSchema}
      sectionName="examinerIdentification"
      onReviewPage={onReviewPage}
      updatePage={updatePage}
      defaultData={{
        examinerName: '',
        examinerTitle: '',
        examinerNPI: '',
        examinerPhone: '',
        facilityPracticeName: '',
        examinerStreetAddress: '',
        examinerUnitNumber: '',
        examinerCity: '',
        examinerState: '',
        examinerZip: '',
      }}
    >
      {({ localData, handleFieldChange, errors, formSubmitted }) => (
        <>
          <fieldset className="vads-u-margin-y--2">
            <legend className="schemaform-block-title">
              <h3 className="vads-u-margin--0">Medical examiner information</h3>
            </legend>

            <va-alert status="info" show-icon class="vads-u-margin-bottom--2">
              <p className="vads-u-margin--0">
                <strong>For medical professionals only:</strong> This section
                must be completed by a licensed MD, DO, Physician Assistant, or
                Advanced Practice Registered Nurse.
              </p>
            </va-alert>

            <p>
              Please provide your professional information for this examination.
            </p>

            {/* Item 16 - Examiner name */}
            <TextInputField
              label="Examiner's full name"
              name="examinerName"
              value={localData.examinerName || ''}
              onChange={handleFieldChange}
              error={errors.examinerName}
              forceShowError={formSubmitted}
              required
              schema={examinerNameSchema}
            />

            {/* Item 17 - Title/Credentials */}
            <SelectField
              label="Professional title/credentials"
              name="examinerTitle"
              value={localData.examinerTitle || ''}
              onChange={handleFieldChange}
              error={errors.examinerTitle}
              forceShowError={formSubmitted}
              required
              schema={examinerTitleSchema}
              options={[
                { value: 'md', label: 'Physician (MD)' },
                { value: 'do', label: 'Doctor of Osteopathic Medicine (DO)' },
                { value: 'pa', label: 'Physician Assistant (PA)' },
                {
                  value: 'aprn',
                  label: 'Advanced Practice Registered Nurse (APRN)',
                },
                { value: 'np', label: 'Nurse Practitioner (NP)' },
                { value: 'cns', label: 'Clinical Nurse Specialist (CNS)' },
              ]}
            />

            {/* Item 18 - NPI Number */}
            <TextInputField
              label="National Provider Identifier (NPI) number"
              name="examinerNPI"
              value={localData.examinerNPI || ''}
              onChange={handleFieldChange}
              error={errors.examinerNPI}
              forceShowError={formSubmitted}
              required
              hint="10-digit NPI number"
              schema={examinerNPISchema}
            />

            {/* Item 19A - Contact phone */}
            <PhoneField
              label="Office phone number"
              name="examinerPhone"
              value={localData.examinerPhone || ''}
              onChange={handleFieldChange}
              error={errors.examinerPhone}
              forceShowError={formSubmitted}
              required
              schema={examinerPhoneSchema}
            />

            {/* Item 19B - Facility information */}
            <h4>Practice/Facility information</h4>

            <TextInputField
              label="Facility/Practice name"
              name="facilityPracticeName"
              value={localData.facilityPracticeName || ''}
              onChange={handleFieldChange}
              error={errors.facilityPracticeName}
              forceShowError={formSubmitted}
              required
              schema={facilityPracticeNameSchema}
            />

            <AddressField
              name="examinerAddress"
              label="Practice/Office address"
              value={{
                street: localData.examinerStreetAddress || '',
                street2: localData.examinerUnitNumber || '',
                city: localData.examinerCity || '',
                state: localData.examinerState || '',
                country: 'USA',
                postalCode: localData.examinerZip || '',
              }}
              onChange={(_, addressValue) => {
                handleFieldChange('examinerStreetAddress', addressValue.street);
                handleFieldChange('examinerUnitNumber', addressValue.street2);
                handleFieldChange('examinerCity', addressValue.city);
                handleFieldChange('examinerState', addressValue.state);
                handleFieldChange('examinerZip', addressValue.postalCode);
              }}
              allowMilitary={false}
              errors={{
                street: errors.examinerStreetAddress,
                city: errors.examinerCity,
                state: errors.examinerState,
                postalCode: errors.examinerZip,
              }}
              forceShowError={formSubmitted}
            />
          </fieldset>
        </>
      )}
    </PageTemplate>
  );
};

ExaminerIdentificationPage.propTypes = {
  goForward: PropTypes.func.isRequired,
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  onReviewPage: PropTypes.bool,
  goBack: PropTypes.func,
  setFormData: PropTypes.func,
  updatePage: PropTypes.func,
};
