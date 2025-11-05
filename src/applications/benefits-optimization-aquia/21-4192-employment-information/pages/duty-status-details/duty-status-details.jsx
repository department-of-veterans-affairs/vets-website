import PropTypes from 'prop-types';
import React from 'react';

import { TextareaField } from '@bio-aquia/shared/components/atoms';
import { PageTemplate } from '@bio-aquia/shared/components/templates';

import { dutyStatusDetailsSchema, statusDetailsSchema } from '../../schemas';

/**
 * Duty Status Details page component
 * This page collects additional details about Reserve or National Guard duty status
 * This page is conditional and only shown if reserveOrGuardStatus === 'yes'
 * @param {Object} props - Component props
 * @param {Object} props.data - Initial form data
 * @param {Function} props.setFormData - Function to update form data
 * @param {Function} props.goForward - Function to proceed to next page
 * @param {Function} props.goBack - Function to go to previous page
 * @returns {JSX.Element} Duty status details form page
 */
export const DutyStatusDetailsPage = ({
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
      title="Duty status"
      data={formDataToUse}
      setFormData={setFormData}
      goForward={goForward}
      goBack={goBack}
      schema={dutyStatusDetailsSchema}
      sectionName="dutyStatusDetails"
      onReviewPage={onReviewPage}
      updatePage={updatePage}
      defaultData={{
        statusDetails: '',
      }}
    >
      {({ localData, handleFieldChange, errors, formSubmitted }) => (
        <>
          <h3 className="vads-u-margin-top--0">
            Reserve or National Guard duty details
          </h3>

          <TextareaField
            name="statusDetails"
            label="Please provide details about the duty status"
            schema={statusDetailsSchema}
            value={localData.statusDetails}
            onChange={handleFieldChange}
            error={errors.statusDetails}
            forceShowError={formSubmitted}
            rows={5}
            maxLength={500}
          />
        </>
      )}
    </PageTemplate>
  );
};

DutyStatusDetailsPage.propTypes = {
  goForward: PropTypes.func.isRequired,
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  goBack: PropTypes.func,
  setFormData: PropTypes.func,
  updatePage: PropTypes.func,
  onReviewPage: PropTypes.bool,
};

export default DutyStatusDetailsPage;
