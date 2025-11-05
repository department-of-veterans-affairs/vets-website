import PropTypes from 'prop-types';
import React from 'react';

import { RadioField, TextareaField } from '@bio-aquia/shared/components/atoms';
import { PageTemplate } from '@bio-aquia/shared/components/templates';

import {
  currentDutyStatusSchema,
  disabilitiesPreventDutiesSchema,
  dutyStatusDetailsSchema,
} from '../../schemas';

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

  // Get veteran name
  const veteranInfo = formDataToUse?.veteranInformation || {};
  const veteranName =
    veteranInfo.firstName || veteranInfo.lastName
      ? `${veteranInfo.firstName || ''} ${veteranInfo.lastName || ''}`.trim()
      : 'the Veteran';

  return (
    <PageTemplate
      title="Reserve or National Guard duty status"
      data={formDataToUse}
      setFormData={setFormData}
      goForward={goForward}
      goBack={goBack}
      schema={dutyStatusDetailsSchema}
      sectionName="dutyStatusDetails"
      onReviewPage={onReviewPage}
      updatePage={updatePage}
      defaultData={{
        currentDutyStatus: '',
        disabilitiesPreventDuties: '',
      }}
    >
      {({ localData, handleFieldChange, errors, formSubmitted }) => (
        <>
          <div className="vads-u-margin-top--neg2">
            <TextareaField
              name="currentDutyStatus"
              label={`What is ${veteranName}'s current duty status?`}
              schema={currentDutyStatusSchema}
              value={localData.currentDutyStatus}
              onChange={handleFieldChange}
              error={errors.currentDutyStatus}
              forceShowError={formSubmitted}
              rows={5}
              maxLength={500}
            />

            <RadioField
              name="disabilitiesPreventDuties"
              label={`Does ${veteranName} have any disabilities that prevent them from performing their military duties?`}
              schema={disabilitiesPreventDutiesSchema}
              value={localData.disabilitiesPreventDuties}
              onChange={handleFieldChange}
              error={errors.disabilitiesPreventDuties}
              forceShowError={formSubmitted}
              options={[
                { value: 'yes', label: 'Yes' },
                { value: 'no', label: 'No' },
              ]}
            />
          </div>
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
