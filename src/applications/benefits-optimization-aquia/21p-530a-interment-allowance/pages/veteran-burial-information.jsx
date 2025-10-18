import PropTypes from 'prop-types';
import React from 'react';
import constants from 'vets-json-schema/dist/constants.json';

import {
  FormField,
  MemorableDateField,
  SelectField,
} from '@bio-aquia/shared/components/atoms';
import { PageTemplate } from '@bio-aquia/shared/components/templates';

import { z } from 'zod';
import {
  cemeteryLocationSchema,
  cemeteryNameSchema,
  dateOfBurialSchema,
} from '../schemas/cemetery-information';
import { dateOfDeathSchema } from '../schemas/veteran-identification';

/**
 * Schema for veteran burial information page
 */
const veteranBurialInformationSchema = z.object({
  dateOfDeath: dateOfDeathSchema,
  dateOfBurial: dateOfBurialSchema,
  cemeteryName: cemeteryNameSchema,
  cemeteryLocation: cemeteryLocationSchema,
});

/**
 * Veteran Burial Information page component for the interment allowance form.
 * Collects the deceased Veteran's date of death, date of burial, and cemetery information.
 * This is the third page in the "Deceased Veteran information" chapter.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} [props.data] - Initial form data from the form system
 * @param {Function} [props.goBack] - Function to navigate to the previous page
 * @param {Function} props.goForward - Function to navigate to the next page
 * @param {Function} [props.setFormData] - Function to update the form data in the form system
 * @returns {JSX.Element} Veteran burial information form page
 *
 * @example
 * ```jsx
 * <VeteranBurialInformationPage
 *   data={formData}
 *   goForward={handleGoForward}
 *   goBack={handleGoBack}
 *   setFormData={setFormData}
 * />
 * ```
 */
export const VeteranBurialInformationPage = ({
  data,
  setFormData,
  goForward,
  goBack,
}) => {
  const formDataToUse =
    data && typeof data === 'object' && !Array.isArray(data) ? data : {};

  return (
    <PageTemplate
      title="Burial information"
      data={formDataToUse}
      setFormData={setFormData}
      goForward={goForward}
      goBack={goBack}
      schema={veteranBurialInformationSchema}
      sectionName="veteranBurialInformation"
      defaultData={{
        dateOfDeath: '',
        dateOfBurial: '',
        cemeteryName: '',
        cemeteryLocation: {
          city: '',
          state: '',
        },
      }}
    >
      {({ localData, handleFieldChange, errors, formSubmitted }) => (
        <>
          <MemorableDateField
            name="dateOfDeath"
            label="Date of death"
            schema={dateOfDeathSchema}
            value={localData.dateOfDeath}
            onChange={handleFieldChange}
            required
            error={errors.dateOfDeath}
            forceShowError={formSubmitted}
          />

          <MemorableDateField
            name="dateOfBurial"
            label="Date of burial"
            schema={dateOfBurialSchema}
            value={localData.dateOfBurial}
            onChange={handleFieldChange}
            required
            error={errors.dateOfBurial}
            forceShowError={formSubmitted}
          />

          <h3 className="vads-u-margin-top--4">Cemetery information</h3>

          <FormField
            name="cemeteryName"
            label="Name"
            value={localData.cemeteryName}
            onChange={handleFieldChange}
            required
            error={errors.cemeteryName}
            forceShowError={formSubmitted}
            schema={cemeteryNameSchema}
          />

          <FormField
            name="cemeteryLocation.city"
            label="City"
            value={localData.cemeteryLocation?.city}
            onChange={handleFieldChange}
            required
            error={
              errors.cemeteryLocation?.city || errors['cemeteryLocation.city']
            }
            forceShowError={formSubmitted}
            schema={cemeteryLocationSchema.shape.city}
          />

          <SelectField
            name="cemeteryLocation.state"
            label="State"
            value={localData.cemeteryLocation?.state}
            onChange={handleFieldChange}
            required
            error={
              errors.cemeteryLocation?.state || errors['cemeteryLocation.state']
            }
            forceShowError={formSubmitted}
            schema={cemeteryLocationSchema.shape.state}
            options={constants.states.USA.filter(
              state => !['AA', 'AE', 'AP'].includes(state.value),
            )}
          />
        </>
      )}
    </PageTemplate>
  );
};

VeteranBurialInformationPage.propTypes = {
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  goBack: PropTypes.func,
  goForward: PropTypes.func.isRequired,
  setFormData: PropTypes.func,
};
