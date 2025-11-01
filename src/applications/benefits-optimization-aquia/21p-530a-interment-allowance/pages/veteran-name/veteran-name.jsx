import PropTypes from 'prop-types';
import React from 'react';

import { FullnameField } from '@bio-aquia/shared/components/molecules';
import { PageTemplate } from '@bio-aquia/shared/components/templates';

import { z } from 'zod';
import { fullNameSchema } from '../../schemas';

/**
 * Schema for veteran name page
 */
const veteranNameSchema = z.object({
  fullName: fullNameSchema,
});

/**
 * Veteran Name page component for the interment allowance form
 * This page collects deceased veteran's name
 * @param {Object} props - Component props
 * @param {Object} props.data - Initial form data
 * @param {Function} props.setFormData - Function to update form data
 * @param {Function} props.goForward - Function to proceed to next page
 * @returns {JSX.Element} Veteran name form page
 */
export const VeteranNamePage = ({
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
      title="Deceased Veteran's name"
      data={formDataToUse}
      setFormData={setFormData}
      goForward={goForward}
      goBack={goBack}
      onReviewPage={onReviewPage}
      updatePage={updatePage}
      schema={veteranNameSchema}
      sectionName="veteranIdentification"
      defaultData={{
        fullName: {
          first: '',
          middle: '',
          last: '',
        },
      }}
    >
      {({ localData, handleFieldChange, errors, formSubmitted }) => (
        <>
          <p className="vads-u-margin-bottom--3">
            Please provide the deceased Veteran’s name.
          </p>

          <FullnameField
            name="fullName"
            value={localData.fullName}
            onChange={handleFieldChange}
            errors={errors}
            forceShowError={formSubmitted}
            label="Veteran's full name"
            required
          />
        </>
      )}
    </PageTemplate>
  );
};

VeteranNamePage.propTypes = {
  goForward: PropTypes.func.isRequired,
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  goBack: PropTypes.func,
  onReviewPage: PropTypes.bool,
  setFormData: PropTypes.func,
  updatePage: PropTypes.func,
};
