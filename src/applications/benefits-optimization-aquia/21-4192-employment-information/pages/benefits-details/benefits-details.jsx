import PropTypes from 'prop-types';
import React from 'react';

import { TextareaField } from '@bio-aquia/shared/components/atoms';
import { PageTemplate } from '@bio-aquia/shared/components/templates';

import { benefitDetailsSchema, benefitsDetailsSchema } from '../../schemas';

/**
 * Benefits Details page component
 * This page collects additional details about benefit entitlements
 * This page is conditional and only shown if benefitEntitlement === 'yes'
 * @param {Object} props - Component props
 * @param {Object} props.data - Initial form data
 * @param {Function} props.setFormData - Function to update form data
 * @param {Function} props.goForward - Function to proceed to next page
 * @param {Function} props.goBack - Function to go to previous page
 * @returns {JSX.Element} Benefits details form page
 */
export const BenefitsDetailsPage = ({
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
      title="Benefits information"
      data={formDataToUse}
      setFormData={setFormData}
      goForward={goForward}
      goBack={goBack}
      schema={benefitsDetailsSchema}
      sectionName="benefitsDetails"
      onReviewPage={onReviewPage}
      updatePage={updatePage}
      defaultData={{
        benefitDetails: '',
      }}
    >
      {({ localData, handleFieldChange, errors, formSubmitted }) => (
        <>
          <h3 className="vads-u-margin-top--0">
            Benefit entitlement and/or payments details
          </h3>

          <TextareaField
            name="benefitDetails"
            label="Please provide details about the benefits"
            schema={benefitDetailsSchema}
            value={localData.benefitDetails}
            onChange={handleFieldChange}
            error={errors.benefitDetails}
            forceShowError={formSubmitted}
            rows={5}
            maxLength={500}
          />
        </>
      )}
    </PageTemplate>
  );
};

BenefitsDetailsPage.propTypes = {
  goForward: PropTypes.func.isRequired,
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  goBack: PropTypes.func,
  setFormData: PropTypes.func,
  updatePage: PropTypes.func,
  onReviewPage: PropTypes.bool,
};

export default BenefitsDetailsPage;
