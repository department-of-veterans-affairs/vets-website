import PropTypes from 'prop-types';
import React from 'react';
import constants from 'vets-json-schema/dist/constants.json';

import { SelectField } from '@bio-aquia/shared/components/atoms';
import { PageTemplate } from '@bio-aquia/shared/components/templates';

import { z } from 'zod';
import { branchOfServiceSchema } from '../../schemas';

/**
 * Schema for service branch page
 */
const serviceBranchPageSchema = z.object({
  branchOfService: branchOfServiceSchema,
});

/**
 * Service Branch page component for the interment allowance form.
 * First page in the service period flow - collects branch of service.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} [props.data] - Initial form data from the form system
 * @param {Function} [props.goBack] - Function to navigate to the previous page
 * @param {Function} props.goForward - Function to navigate to the next page
 * @param {Function} [props.setFormData] - Function to update the form data in the form system
 * @param {boolean} [props.onReviewPage] - Whether the page is being displayed in review mode
 * @param {Function} [props.updatePage] - Function to update the page in review mode
 * @returns {JSX.Element} Service branch form page
 */
export const ServiceBranchPage = ({
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
      title="Branch of service"
      data={formDataToUse}
      setFormData={setFormData}
      goForward={goForward}
      goBack={goBack}
      onReviewPage={onReviewPage}
      updatePage={updatePage}
      schema={serviceBranchPageSchema}
      sectionName="tempServicePeriod"
      defaultData={{
        branchOfService: '',
      }}
    >
      {({ localData, handleFieldChange, errors, formSubmitted }) => (
        <>
          <p className="vads-u-margin-bottom--3">
            Please select the branch of service for this service period.
          </p>

          <SelectField
            name="branchOfService"
            label="Branch of service"
            value={localData.branchOfService || ''}
            onChange={handleFieldChange}
            required
            error={errors.branchOfService}
            forceShowError={formSubmitted}
            schema={branchOfServiceSchema}
            options={constants.branchesServed}
          />
        </>
      )}
    </PageTemplate>
  );
};

ServiceBranchPage.propTypes = {
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  onReviewPage: PropTypes.bool,
  goBack: PropTypes.func,
  goForward: PropTypes.func.isRequired,
  setFormData: PropTypes.func,
  updatePage: PropTypes.func,
};
