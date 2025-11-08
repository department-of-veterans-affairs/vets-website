import PropTypes from 'prop-types';
import React from 'react';
import constants from 'vets-json-schema/dist/constants.json';

import {
  MemorableDateField,
  SelectField,
  TextInputField,
} from '@bio-aquia/shared/components/atoms';
import { PageTemplate } from '@bio-aquia/shared/components/templates';

import { z } from 'zod';
import {
  cemeteryLocationSchema,
  cemeteryNameSchema,
  dateOfBurialSchema,
} from '@bio-aquia/21p-530a-interment-allowance/schemas/burial-information';
import { dateOfDeathSchema } from '@bio-aquia/21p-530a-interment-allowance/schemas/veteran-identification';

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
  onReviewPage,
  updatePage,
}) => {
  const formDataToUse =
    data && typeof data === 'object' && !Array.isArray(data) ? data : {};

  return (
    <PageTemplate
      title="Veteran’s burial information"
      data={formDataToUse}
      setFormData={setFormData}
      goForward={goForward}
      goBack={goBack}
      onReviewPage={onReviewPage}
      updatePage={updatePage}
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
            monthSelect
            schema={dateOfDeathSchema}
            value={localData.dateOfDeath}
            onChange={handleFieldChange}
            required
            remove-date-hint
            error={errors.dateOfDeath}
            forceShowError={formSubmitted}
          />
          <div className="vads-u-margin-top--4">
            <MemorableDateField
              name="dateOfBurial"
              label="Date of burial"
              monthSelect
              schema={dateOfBurialSchema}
              value={localData.dateOfBurial}
              onChange={handleFieldChange}
              required
              remove-date-hint
              error={errors.dateOfBurial}
              forceShowError={formSubmitted}
            />
          </div>
          <h4 className="vads-u-margin-top--4">Cemetery information</h4>

          <TextInputField
            name="cemeteryName"
            label="Name"
            value={localData.cemeteryName}
            onChange={handleFieldChange}
            required
            error={errors.cemeteryName}
            forceShowError={formSubmitted}
            schema={cemeteryNameSchema}
          />

          <TextInputField
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
  goForward: PropTypes.func.isRequired,
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  goBack: PropTypes.func,
  setFormData: PropTypes.func,
  updatePage: PropTypes.func,
  onReviewPage: PropTypes.bool,
};
