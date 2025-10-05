import PropTypes from 'prop-types';
import React from 'react';
import { z } from 'zod';

import {
  FormField,
  MemorableDateField,
  RadioField,
  TextareaField,
} from '@bio-aquia/shared/components/atoms';
import { PageTemplate } from '@bio-aquia/shared/components/templates';
import { transformDates } from '@bio-aquia/shared/forms';

import { BRANCH_OF_SERVICE } from '@bio-aquia/21p-530a-interment-allowance/constants';
import {
  branchOfServiceSchema,
  dateEnteredServiceSchema,
  dateSeparatedSchema,
  veteranServiceSchema,
} from '@bio-aquia/21p-530a-interment-allowance/schemas';

/**
 * Data processor to ensure date values are properly formatted strings
 */
const ensureDateStrings = formData => {
  return transformDates(formData, ['dateEnteredService', 'dateSeparated']);
};

/**
 * Veteran Service page component for the interment allowance form
 * This page collects veteran's military service information
 * @param {Object} props - Component props
 * @param {Object} props.data - Initial form data
 * @param {Function} props.setFormData - Function to update form data
 * @param {Function} props.goForward - Function to proceed to next page
 * @returns {JSX.Element} Veteran service form page
 */
export const VeteranServicePage = ({
  data,
  setFormData,
  goForward,
  goBack,
}) => {
  const formDataToUse =
    data && typeof data === 'object' && !Array.isArray(data) ? data : {};

  return (
    <PageTemplate
      title="Veteran's active duty service"
      data={formDataToUse}
      setFormData={setFormData}
      goForward={goForward}
      goBack={goBack}
      schema={veteranServiceSchema}
      sectionName="veteranService"
      dataProcessor={ensureDateStrings}
      defaultData={{
        branchOfService: '',
        dateEnteredService: '',
        placeEnteredService: '',
        rankAtSeparation: '',
        dateSeparated: '',
        placeSeparated: '',
        alternateNameInfo: {
          hasAlternateName: '',
          alternateName: '',
          alternateServiceInfo: '',
        },
      }}
    >
      {({ localData, handleFieldChange, errors, formSubmitted }) => (
        <>
          <p className="vads-u-margin-bottom--3">
            Please provide information about the veteran’s military service.
          </p>

          <RadioField
            name="branchOfService"
            label="Branch of service"
            options={BRANCH_OF_SERVICE}
            value={localData.branchOfService}
            onChange={handleFieldChange}
            required
            error={errors.branchOfService}
            forceShowError={formSubmitted}
            schema={branchOfServiceSchema}
          />

          <MemorableDateField
            name="dateEnteredService"
            label="Date entered active service"
            schema={dateEnteredServiceSchema}
            value={localData.dateEnteredService}
            onChange={handleFieldChange}
            required
            error={errors.dateEnteredService}
            forceShowError={formSubmitted}
          />

          <FormField
            name="placeEnteredService"
            label="Place entered active service"
            value={localData.placeEnteredService}
            onChange={handleFieldChange}
            required
            hint="City and state or military installation"
            error={errors.placeEnteredService}
            forceShowError={formSubmitted}
          />

          <FormField
            name="rankAtSeparation"
            label="Grade, rank or rating when separated from service"
            value={localData.rankAtSeparation}
            onChange={handleFieldChange}
            required
            hint="For example: E-5, Sergeant, Petty Officer Second Class"
            error={errors.rankAtSeparation}
            forceShowError={formSubmitted}
          />

          <MemorableDateField
            name="dateSeparated"
            label="Date left active service"
            schema={dateSeparatedSchema}
            value={localData.dateSeparated}
            onChange={handleFieldChange}
            required
            error={errors.dateSeparated}
            forceShowError={formSubmitted}
          />

          <FormField
            name="placeSeparated"
            label="Place left active service"
            value={localData.placeSeparated}
            onChange={handleFieldChange}
            required
            hint="City and state or military installation"
            error={errors.placeSeparated}
            forceShowError={formSubmitted}
          />

          <va-fieldset className="vads-u-margin-top--3">
            <legend className="schemaform-block-title">
              Service under another name
            </legend>

            <RadioField
              name="alternateNameInfo.hasAlternateName"
              label="Did the veteran serve under another name?"
              options={[
                { value: 'yes', label: 'Yes' },
                { value: 'no', label: 'No' },
              ]}
              value={localData.alternateNameInfo?.hasAlternateName}
              onChange={handleFieldChange}
              required
              error={errors['alternateNameInfo.hasAlternateName']}
              forceShowError={formSubmitted}
              schema={z.enum(['yes', 'no'])}
            />

            {localData.alternateNameInfo?.hasAlternateName === 'yes' && (
              <>
                <FormField
                  name="alternateNameInfo.alternateName"
                  label="Name veteran served under"
                  value={localData.alternateNameInfo?.alternateName}
                  onChange={handleFieldChange}
                  required
                  error={errors['alternateNameInfo.alternateName']}
                  forceShowError={formSubmitted}
                />

                <TextareaField
                  name="alternateNameInfo.alternateServiceInfo"
                  label="Service information under alternate name"
                  value={localData.alternateNameInfo?.alternateServiceInfo}
                  onChange={handleFieldChange}
                  required
                  hint="Include branch, dates, and locations of service"
                  error={errors['alternateNameInfo.alternateServiceInfo']}
                  forceShowError={formSubmitted}
                />
              </>
            )}
          </va-fieldset>
        </>
      )}
    </PageTemplate>
  );
};

VeteranServicePage.propTypes = {
  goForward: PropTypes.func.isRequired,
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  goBack: PropTypes.func,
  setFormData: PropTypes.func,
};
