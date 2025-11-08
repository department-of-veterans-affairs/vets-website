import PropTypes from 'prop-types';
import React from 'react';

import { CurrencyField } from '@bio-aquia/shared/components/atoms';
import { PageTemplate } from '@bio-aquia/shared/components/templates';

import {
  monthlyCostsSchema,
  monthlyOutOfPocketSchema,
} from '@bio-aquia/21-0779-nursing-home-information/schemas/monthly-costs';

/**
 * Monthly Costs page component for the nursing home information form
 * This page collects the monthly out-of-pocket costs paid to the nursing home
 * @param {Object} props - Component props
 * @param {Object} props.data - Initial form data
 * @param {Function} props.setFormData - Function to update form data
 * @param {Function} props.goForward - Function to proceed to next page
 * @returns {JSX.Element} Monthly costs form page
 */
export const MonthlyCostsPage = ({ data, setFormData, goForward, goBack }) => {
  const formDataToUse =
    data && typeof data === 'object' && !Array.isArray(data) ? data : {};

  return (
    <PageTemplate
      title="Monthly costs"
      data={formDataToUse}
      setFormData={setFormData}
      goForward={goForward}
      goBack={goBack}
      schema={monthlyCostsSchema}
      sectionName="monthlyCosts"
      defaultData={{
        monthlyOutOfPocket: '',
      }}
    >
      {({ localData, handleFieldChange, errors, formSubmitted }) => (
        <>
          <CurrencyField
            name="monthlyOutOfPocket"
            label="What is the amount the patient needs to pay out of their own pocket every month?"
            hint="Include the patient’s Share of Cost Medicaid"
            schema={monthlyOutOfPocketSchema}
            value={localData.monthlyOutOfPocket}
            onChange={handleFieldChange}
            required
            error={errors.monthlyOutOfPocket}
            forceShowError={formSubmitted}
          />
        </>
      )}
    </PageTemplate>
  );
};

MonthlyCostsPage.propTypes = {
  goForward: PropTypes.func.isRequired,
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  goBack: PropTypes.func,
  setFormData: PropTypes.func,
};
