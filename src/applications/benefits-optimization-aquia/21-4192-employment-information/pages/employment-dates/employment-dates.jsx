import PropTypes from 'prop-types';
import React from 'react';

import {
  MemorableDateField,
  TextareaField,
} from '@bio-aquia/shared/components/atoms';
import { PageTemplate } from '@bio-aquia/shared/components/templates';
import { transformDates } from '@bio-aquia/shared/forms';

import {
  beginningDateSchema,
  employmentDatesSchema,
  endingDateSchema,
  typeOfWorkSchema,
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

  return (
    <PageTemplate
      title="Employment information"
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
        typeOfWork: '',
      }}
    >
      {({ localData, handleFieldChange, errors, formSubmitted }) => (
        <>
          <MemorableDateField
            name="beginningDate"
            label="Beginning date of employment"
            schema={beginningDateSchema}
            value={localData.beginningDate}
            onChange={handleFieldChange}
            error={errors.beginningDate}
            forceShowError={formSubmitted}
          />

          <MemorableDateField
            name="endingDate"
            label="Ending date of employment"
            schema={endingDateSchema}
            value={localData.endingDate}
            onChange={handleFieldChange}
            error={errors.endingDate}
            forceShowError={formSubmitted}
          />

          <TextareaField
            name="typeOfWork"
            label="Type of work performed"
            schema={typeOfWorkSchema}
            value={localData.typeOfWork}
            onChange={handleFieldChange}
            error={errors.typeOfWork}
            forceShowError={formSubmitted}
            rows={5}
            maxLength={1000}
          />
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
