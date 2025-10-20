import PropTypes from 'prop-types';
import React from 'react';

import { RadioField } from '@bio-aquia/shared/components/atoms';
import { PageTemplate } from '@bio-aquia/shared/components/templates';

import {
  benefitEntitlementSchema,
  benefitsInformationSchema,
} from '../../schemas';

/**
 * Benefits Information page component
 * This page collects information about benefit entitlements
 * @param {Object} props - Component props
 * @param {Object} props.data - Initial form data
 * @param {Function} props.setFormData - Function to update form data
 * @param {Function} props.goForward - Function to proceed to next page
 * @param {Function} props.goBack - Function to go to previous page
 * @returns {JSX.Element} Benefits information form page
 */
export const BenefitsInformationPage = ({
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
      schema={benefitsInformationSchema}
      sectionName="benefitsInformation"
      onReviewPage={onReviewPage}
      updatePage={updatePage}
      defaultData={{
        benefitEntitlement: '',
      }}
    >
      {({ localData, handleFieldChange, errors, formSubmitted }) => (
        <>
          <h3 className="vads-u-margin-top--0">
            Benefit entitlement and/or payments
          </h3>

          <RadioField
            name="benefitEntitlement"
            label="Is the Veteran receiving or entitled to receive, as a result of his/her employment with you, sick, retirement or other benefits?"
            schema={benefitEntitlementSchema}
            value={localData.benefitEntitlement}
            onChange={handleFieldChange}
            error={errors.benefitEntitlement}
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

BenefitsInformationPage.propTypes = {
  goForward: PropTypes.func.isRequired,
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  goBack: PropTypes.func,
  setFormData: PropTypes.func,
  updatePage: PropTypes.func,
  onReviewPage: PropTypes.bool,
};

export default BenefitsInformationPage;
