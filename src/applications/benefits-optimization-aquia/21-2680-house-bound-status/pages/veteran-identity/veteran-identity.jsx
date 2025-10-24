import PropTypes from 'prop-types';
import React from 'react';

import {
  MemorableDateField,
  SSNField,
} from '@bio-aquia/shared/components/atoms';
import { FullnameField } from '@bio-aquia/shared/components/molecules';
import { PageTemplate } from '@bio-aquia/shared/components/templates';
import { transformDates } from '@bio-aquia/shared/forms';

import {
  veteranSSNSchema,
  veteranDOBSchema,
  veteranIdentificationPageSchema,
} from '@bio-aquia/21-2680-house-bound-status/schemas';

/**
 * Data processor to ensure date values are properly formatted strings
 */
const ensureDateStrings = formData => {
  return transformDates(formData, ['veteranDob']);
};

/**
 * Veteran Identity Page
 * Section I - Items 1-5: Veteran identification information
 * @module pages/veteran-identity
 */
export const VeteranIdentityPage = ({
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
      title="Veteran information"
      data={formDataToUse}
      setFormData={setFormData}
      goForward={goForward}
      goBack={goBack}
      schema={veteranIdentificationPageSchema}
      sectionName="veteranIdentification"
      dataProcessor={ensureDateStrings}
      onReviewPage={onReviewPage}
      updatePage={updatePage}
      defaultData={{
        veteranFullName: {
          first: '',
          middle: '',
          last: '',
        },
        veteranSsn: '',
        veteranDob: '',
      }}
    >
      {({ localData, handleFieldChange, errors, formSubmitted }) => (
        <>
          <p className="vads-u-font-family--serif vads-u-font-weight--bold vads-u-font-size--lg vads-u-line-height--1">
            Confirm the personal information we have on file for the Veteran.
          </p>

          <FullnameField
            fieldPrefix="veteran"
            value={localData.veteranFullName}
            onChange={handleFieldChange}
            errors={errors.veteranFullName || {}}
            forceShowError={formSubmitted}
            required
            label="Veteran's full name"
            showSuffix={false}
          />

          <SSNField
            label="Social Security number"
            name="veteranSsn"
            value={localData.veteranSsn || ''}
            onChange={handleFieldChange}
            error={errors.veteranSsn}
            forceShowError={formSubmitted}
            required
            schema={veteranSSNSchema}
          />

          <MemorableDateField
            label="Date of birth"
            name="veteranDob"
            value={localData.veteranDob || ''}
            onChange={handleFieldChange}
            error={errors.veteranDob}
            forceShowError={formSubmitted}
            required
            schema={veteranDOBSchema}
          />
        </>
      )}
    </PageTemplate>
  );
};

VeteranIdentityPage.propTypes = {
  goForward: PropTypes.func.isRequired,
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  goBack: PropTypes.func,
  setFormData: PropTypes.func,
  updatePage: PropTypes.func,
  onReviewPage: PropTypes.bool,
};
