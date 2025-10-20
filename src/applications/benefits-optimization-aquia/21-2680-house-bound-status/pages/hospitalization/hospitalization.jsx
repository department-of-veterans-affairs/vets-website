import PropTypes from 'prop-types';
import React from 'react';

import { transformDates } from '@bio-aquia/shared/forms';
import { PageTemplate } from '@bio-aquia/shared/components/templates';
import {
  MemorableDateField,
  TextInputField,
} from '@bio-aquia/shared/components/atoms';
import { AddressField } from '@bio-aquia/shared/components/molecules';
import {
  admissionDateSchema,
  facilityNameSchema,
  hospitalizationSchema,
} from '@bio-aquia/21-2680-house-bound-status/schemas';

const ensureDateStrings = formData => {
  return transformDates(formData, ['admissionDate']);
};

/**
 * Hospitalization Page
 * Section IV - Items 14A-14D: Hospitalization information
 * @module pages/hospitalization
 */
export const HospitalizationPage = ({
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
      title="Hospitalization information"
      data={formDataToUse}
      setFormData={setFormData}
      goForward={goForward}
      goBack={goBack}
      schema={hospitalizationSchema}
      sectionName="hospitalization"
      onReviewPage={onReviewPage}
      updatePage={updatePage}
      dataProcessor={ensureDateStrings}
      defaultData={{
        isCurrentlyHospitalized: '',
        admissionDate: '',
        facilityName: '',
        facilityStreetAddress: '',
        facilityCity: '',
        facilityState: '',
        facilityZip: '',
      }}
    >
      {({ localData, handleFieldChange, errors, formSubmitted }) => {
        const isHospitalized = localData.isCurrentlyHospitalized === 'yes';

        return (
          <>
            <fieldset className="vads-u-margin-y--2">
              <legend className="schemaform-block-title">
                <h3 className="vads-u-margin--0">
                  Hospitalization information
                </h3>
              </legend>

              <p>
                Provide details about current hospitalization or nursing home
                care.
              </p>

              {/* Item 14A - Currently hospitalized */}
              <va-radio
                label="Are you (or the Veteran) currently hospitalized or in a nursing home?"
                name="isCurrentlyHospitalized"
                value={localData.isCurrentlyHospitalized || ''}
                onVaValueChange={e =>
                  handleFieldChange('isCurrentlyHospitalized', e.detail.value)
                }
                error={errors.isCurrentlyHospitalized}
                required
              >
                <va-radio-option label="Yes" value="yes" />
                <va-radio-option label="No" value="no" />
              </va-radio>

              {isHospitalized && (
                <>
                  {/* Item 14B - Admission date */}
                  <MemorableDateField
                    label="Date of admission"
                    name="admissionDate"
                    value={localData.admissionDate || ''}
                    onChange={handleFieldChange}
                    error={errors.admissionDate}
                    forceShowError={formSubmitted}
                    required
                    schema={admissionDateSchema}
                  />

                  {/* Item 14C - Facility name */}
                  <TextInputField
                    label="Name of hospital or nursing home"
                    name="facilityName"
                    value={localData.facilityName || ''}
                    onChange={handleFieldChange}
                    error={errors.facilityName}
                    forceShowError={formSubmitted}
                    required
                    schema={facilityNameSchema}
                  />

                  {/* Item 14D - Facility address */}
                  <AddressField
                    name="facilityAddress"
                    label="Facility address"
                    value={{
                      street: localData.facilityStreetAddress || '',
                      city: localData.facilityCity || '',
                      state: localData.facilityState || '',
                      country: 'USA',
                      postalCode: localData.facilityZip || '',
                    }}
                    onChange={(_, addressValue) => {
                      handleFieldChange(
                        'facilityStreetAddress',
                        addressValue.street,
                      );
                      handleFieldChange('facilityCity', addressValue.city);
                      handleFieldChange('facilityState', addressValue.state);
                      handleFieldChange('facilityZip', addressValue.postalCode);
                    }}
                    allowMilitary={false}
                    errors={{
                      street: errors.facilityStreetAddress,
                      city: errors.facilityCity,
                      state: errors.facilityState,
                      postalCode: errors.facilityZip,
                    }}
                    forceShowError={formSubmitted}
                  />
                </>
              )}
            </fieldset>
          </>
        );
      }}
    </PageTemplate>
  );
};

HospitalizationPage.propTypes = {
  goForward: PropTypes.func.isRequired,
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  onReviewPage: PropTypes.bool,
  goBack: PropTypes.func,
  setFormData: PropTypes.func,
  updatePage: PropTypes.func,
};

export default HospitalizationPage;
