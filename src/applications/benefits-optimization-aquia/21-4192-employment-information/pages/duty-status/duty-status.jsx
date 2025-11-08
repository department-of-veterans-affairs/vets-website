import PropTypes from 'prop-types';
import React from 'react';

import { RadioField } from '@bio-aquia/shared/components/atoms';
import { PageTemplate } from '@bio-aquia/shared/components/templates';

import { dutyStatusSchema, reserveOrGuardStatusSchema } from '../../schemas';

/**
 * Duty Status page component
 * This page collects Reserve or National Guard duty status information
 * @param {Object} props - Component props
 * @param {Object} props.data - Initial form data
 * @param {Function} props.setFormData - Function to update form data
 * @param {Function} props.goForward - Function to proceed to next page
 * @param {Function} props.goBack - Function to go to previous page
 * @returns {JSX.Element} Duty status form page
 */
export const DutyStatusPage = ({
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
      schema={dutyStatusSchema}
      sectionName="dutyStatus"
      onReviewPage={onReviewPage}
      updatePage={updatePage}
      defaultData={{
        reserveOrGuardStatus: '',
      }}
    >
      {({ localData, handleFieldChange, errors, formSubmitted }) => (
        <>
          <div className="vads-u-margin-top--neg2">
            <RadioField
              name="reserveOrGuardStatus"
              label={`Is ${veteranName} currently in the Reserve or National Guard?`}
              schema={reserveOrGuardStatusSchema}
              value={localData.reserveOrGuardStatus}
              onChange={handleFieldChange}
              error={errors.reserveOrGuardStatus}
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

DutyStatusPage.propTypes = {
  goForward: PropTypes.func.isRequired,
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  goBack: PropTypes.func,
  setFormData: PropTypes.func,
  updatePage: PropTypes.func,
  onReviewPage: PropTypes.bool,
};

export default DutyStatusPage;
