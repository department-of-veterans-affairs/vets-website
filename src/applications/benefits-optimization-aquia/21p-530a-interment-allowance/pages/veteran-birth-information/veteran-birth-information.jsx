import PropTypes from 'prop-types';
import React from 'react';
import constants from 'vets-json-schema/dist/constants.json';

import {
  TextInputField,
  MemorableDateField,
  SelectField,
} from '@bio-aquia/shared/components/atoms';
import { PageTemplate } from '@bio-aquia/shared/components/templates';

import { z } from 'zod';
import {
  dateOfBirthSchema,
  placeOfBirthSchema,
} from '@bio-aquia/21p-530a-interment-allowance/schemas';

/**
 * Schema for veteran birth information page
 */
const veteranBirthInformationSchema = z.object({
  dateOfBirth: dateOfBirthSchema,
  placeOfBirth: placeOfBirthSchema,
});

/**
 * Veteran Birth Information page component for the interment allowance form.
 * Collects the deceased Veteran's date of birth and place of birth (city and state).
 * This is the second page in the "Deceased Veteran information" chapter.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} [props.data] - Initial form data from the form system
 * @param {Function} [props.goBack] - Function to navigate to the previous page
 * @param {Function} props.goForward - Function to navigate to the next page
 * @param {Function} [props.setFormData] - Function to update the form data in the form system
 * @returns {JSX.Element} Veteran birth information form page
 *
 * @example
 * ```jsx
 * <VeteranBirthInformationPage
 *   data={formData}
 *   goForward={handleGoForward}
 *   goBack={handleGoBack}
 *   setFormData={setFormData}
 * />
 * ```
 */
export const VeteranBirthInformationPage = ({
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
      title="Birth information"
      data={formDataToUse}
      setFormData={setFormData}
      goForward={goForward}
      goBack={goBack}
      onReviewPage={onReviewPage}
      updatePage={updatePage}
      schema={veteranBirthInformationSchema}
      sectionName="veteranBirthInformation"
      defaultData={{
        dateOfBirth: '',
        placeOfBirth: {
          city: '',
          state: '',
        },
      }}
    >
      {({ localData, handleFieldChange, errors, formSubmitted }) => (
        <>
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

          <TextInputField
            name="placeOfBirth.city"
            label="City of birth"
            value={localData.placeOfBirth?.city}
            onChange={handleFieldChange}
            required
            error={errors.placeOfBirth?.city || errors['placeOfBirth.city']}
            forceShowError={formSubmitted}
            schema={placeOfBirthSchema.shape.city}
          />

          <SelectField
            name="placeOfBirth.state"
            label="State of birth"
            value={localData.placeOfBirth?.state}
            onChange={handleFieldChange}
            required
            error={errors.placeOfBirth?.state || errors['placeOfBirth.state']}
            forceShowError={formSubmitted}
            schema={placeOfBirthSchema.shape.state}
            options={constants.states.USA.filter(
              state => !['AA', 'AE', 'AP'].includes(state.value),
            )}
          />
        </>
      )}
    </PageTemplate>
  );
};

VeteranBirthInformationPage.propTypes = {
  goForward: PropTypes.func.isRequired,
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  goBack: PropTypes.func,
  onReviewPage: PropTypes.bool,
  setFormData: PropTypes.func,
  updatePage: PropTypes.func,
};
