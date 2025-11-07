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

  // Get veteran name
  const veteranInfo = formDataToUse?.veteranInformation || {};
  const veteranName =
    veteranInfo.firstName || veteranInfo.lastName
      ? `${veteranInfo.firstName || ''} ${veteranInfo.lastName || ''}`.trim()
      : 'the Veteran';

  // Determine if currently employed to use correct tense
  const currentlyEmployed =
    formDataToUse?.employmentDates?.currentlyEmployed || false;
  const tense = currentlyEmployed ? 'are' : 'were';

  return (
    <PageTemplate
      title="Concessions"
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
          <div className="vads-u-margin-top--neg2">
            <TextareaField
              name="concessions"
              label={`What concessions (if any) ${tense} made to ${veteranName} because of age or disability?`}
              schema={concessionsSchema}
              value={localData.concessions}
              onChange={handleFieldChange}
              error={errors.concessions}
              forceShowError={formSubmitted}
              rows={5}
              maxLength={1000}
            />
          </div>
        </>
      )}
    </PageTemplate>
  );
};

EmploymentConcessionsPage.propTypes = {
  goForward: PropTypes.func.isRequired,
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  goBack: PropTypes.func,
  setFormData: PropTypes.func,
  updatePage: PropTypes.func,
  onReviewPage: PropTypes.bool,
};

export default EmploymentConcessionsPage;
