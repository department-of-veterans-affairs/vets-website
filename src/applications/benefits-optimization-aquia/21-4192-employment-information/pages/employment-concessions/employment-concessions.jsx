import PropTypes from 'prop-types';
import React from 'react';

import { TextareaField } from '@bio-aquia/shared/components/atoms';
import { PageTemplate } from '@bio-aquia/shared/components/templates';

import { concessionsSchema, employmentConcessionsSchema } from '../../schemas';

/**
 * Employment Concessions page component
 * This page collects information about concessions made to the employee
 * @param {Object} props - Component props
 * @param {Object} props.data - Initial form data
 * @param {Function} props.setFormData - Function to update form data
 * @param {Function} props.goForward - Function to proceed to next page
 * @param {Function} props.goBack - Function to go to previous page
 * @returns {JSX.Element} Employment concessions form page
 */
export const EmploymentConcessionsPage = ({
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
      schema={employmentConcessionsSchema}
      sectionName="employmentConcessions"
      onReviewPage={onReviewPage}
      updatePage={updatePage}
      defaultData={{
        concessions: '',
      }}
    >
      {({ localData, handleFieldChange, errors, formSubmitted }) => (
        <>
          <h3 className="vads-u-margin-top--0">Concessions</h3>

          <TextareaField
            name="concessions"
            label="Concessions (if any) made to employee by reason of age or disability"
            schema={concessionsSchema}
            value={localData.concessions}
            onChange={handleFieldChange}
            error={errors.concessions}
            forceShowError={formSubmitted}
            rows={5}
            maxLength={1000}
          />
        </>
      )}
    </PageTemplate>
  );
};

EmploymentConcessionsPage.propTypes = {
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  onReviewPage: PropTypes.bool,
  goBack: PropTypes.func,
  goForward: PropTypes.func.isRequired,
  setFormData: PropTypes.func,
  updatePage: PropTypes.func,
};

export default EmploymentConcessionsPage;
