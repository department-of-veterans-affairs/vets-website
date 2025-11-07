import PropTypes from 'prop-types';
import React from 'react';

import {
  CheckboxField,
  MemorableDateField,
} from '@bio-aquia/shared/components/atoms';
import { PageTemplate } from '@bio-aquia/shared/components/templates';
import { transformDates } from '@bio-aquia/shared/forms';

import {
  beginningDateSchema,
  currentlyEmployedSchema,
  employmentDatesSchema,
  endingDateSchema,
} from '../../schemas';

/**
 * Data processor to ensure date values are properly formatted strings
 */
const ensureDateStrings = formData => {
  return transformDates(formData, ['beginningDate', 'endingDate']);
};

/**
 * Employment Dates page component
 * This page collects employment dates and work type information
 * @param {Object} props - Component props
 * @param {Object} props.data - Initial form data
 * @param {Function} props.setFormData - Function to update form data
 * @param {Function} props.goForward - Function to proceed to next page
 * @param {Function} props.goBack - Function to go to previous page
 * @returns {JSX.Element} Employment dates form page
 */
export const EmploymentDatesPage = ({
  data,
  setFormData,
  goForward,
  goBack,
  onReviewPage,
  updatePage,
}) => {
  const formDataToUse =
    data && typeof data === 'object' && !Array.isArray(data) ? data : {};

  // Get veteran name
  const veteranInfo = formDataToUse?.veteranInformation || {};
  const veteranName =
    veteranInfo.firstName || veteranInfo.lastName
      ? `${veteranInfo.firstName || ''} ${veteranInfo.lastName || ''}`.trim()
      : 'Veteran';

  // Get employer name
  const employerName =
    formDataToUse?.employerInformation?.employerName || 'this employer';

  return (
    <PageTemplate
      title={`${veteranName}'s dates of employment`}
      data={formDataToUse}
      setFormData={setFormData}
      goForward={goForward}
      goBack={goBack}
      schema={employmentDatesSchema}
      sectionName="employmentDates"
      dataProcessor={ensureDateStrings}
      onReviewPage={onReviewPage}
      updatePage={updatePage}
      defaultData={{
        beginningDate: '',
        endingDate: '',
        currentlyEmployed: false,
      }}
    >
      {({ localData, handleFieldChange, errors, formSubmitted }) => (
        <>
          <MemorableDateField
            name="beginningDate"
            label={`When did ${veteranName} start working for ${employerName}?`}
            schema={beginningDateSchema}
            value={localData.beginningDate}
            onChange={handleFieldChange}
            error={errors.beginningDate}
            forceShowError={formSubmitted}
            required
          />

          <div className="vads-u-margin-top--3">
            <CheckboxField
              name="currentlyEmployed"
              label={`${veteranName} is currently employed at ${employerName}.`}
              schema={currentlyEmployedSchema}
              value={localData.currentlyEmployed}
              onChange={handleFieldChange}
              error={errors.currentlyEmployed}
              forceShowError={formSubmitted}
            />
          </div>

          {!localData.currentlyEmployed && (
            <MemorableDateField
              name="endingDate"
              label={`When did ${veteranName} stop working for ${employerName}?`}
              schema={endingDateSchema}
              value={localData.endingDate}
              onChange={handleFieldChange}
              error={errors.endingDate}
              forceShowError={formSubmitted}
              required
            />
          )}
        </>
      )}
    </PageTemplate>
  );
};

EmploymentDatesPage.propTypes = {
  goForward: PropTypes.func.isRequired,
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  goBack: PropTypes.func,
  setFormData: PropTypes.func,
  updatePage: PropTypes.func,
  onReviewPage: PropTypes.bool,
};

export default EmploymentDatesPage;
