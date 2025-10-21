import PropTypes from 'prop-types';
import React from 'react';

import { RadioField } from '@bio-aquia/shared/components/atoms';
import { PageTemplate } from '@bio-aquia/shared/components/templates';

import { dutyStatusSchema, reserveOrGuardStatusSchema } from '../schemas';

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

  return (
    <PageTemplate
      title="Duty status"
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
          <h3 className="vads-u-margin-top--0">
            Reserve or National Guard duty status
          </h3>

          <RadioField
            name="reserveOrGuardStatus"
            label="Is the Veteran currently in the Reserve or National Guard?"
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
        </>
      )}
    </PageTemplate>
  );
};

DutyStatusPage.propTypes = {
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  onReviewPage: PropTypes.bool,
  goBack: PropTypes.func,
  goForward: PropTypes.func.isRequired,
  setFormData: PropTypes.func,
  updatePage: PropTypes.func,
};

export default DutyStatusPage;
