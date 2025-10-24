import PropTypes from 'prop-types';
import React from 'react';

import { PageTemplate } from '@bio-aquia/shared/components/templates';
import { PhoneField, TextInputField } from '@bio-aquia/shared/components/atoms';

import {
  claimantPhoneNumberSchema,
  claimantMobilePhoneSchema,
  claimantEmailSchema,
  claimantContactPageSchema,
} from '@bio-aquia/21-2680-house-bound-status/schemas';

/**
 * Claimant Contact Page
 * Collects claimant's contact information (phone, mobile, email)
 * Labels dynamically include claimant's first name
 * @module pages/claimant-contact
 */
export const ClaimantContactPage = ({
  data,
  setFormData,
  goForward,
  goBack,
  onReviewPage,
  updatePage,
}) => {
  const formDataToUse =
    data && typeof data === 'object' && !Array.isArray(data) ? data : {};

  // Get claimant's first name for dynamic labels
  const claimantFirstName =
    formDataToUse?.claimantInformation?.claimantFullName?.first || 'Claimant';

  return (
    <PageTemplate
      title="Claimant contact information"
      data={formDataToUse}
      setFormData={setFormData}
      goForward={goForward}
      goBack={goBack}
      schema={claimantContactPageSchema}
      sectionName="claimantContact"
      onReviewPage={onReviewPage}
      updatePage={updatePage}
      defaultData={{
        claimantPhoneNumber: '',
        claimantMobilePhone: '',
        claimantEmail: '',
      }}
    >
      {({ localData, handleFieldChange, errors, formSubmitted }) => (
        <>
          <p>
            Enter your contact information as the person filing on behalf of the
            Veteran.
          </p>

          <PhoneField
            label={`${claimantFirstName}'s home phone number`}
            name="claimantPhoneNumber"
            value={localData.claimantPhoneNumber || ''}
            onChange={handleFieldChange}
            error={errors.claimantPhoneNumber}
            forceShowError={formSubmitted}
            required
            schema={claimantPhoneNumberSchema}
          />

          <PhoneField
            label={`${claimantFirstName}'s mobile phone number`}
            name="claimantMobilePhone"
            value={localData.claimantMobilePhone || ''}
            onChange={handleFieldChange}
            error={errors.claimantMobilePhone}
            forceShowError={formSubmitted}
            hint="Optional"
            schema={claimantMobilePhoneSchema}
          />

          <TextInputField
            label={`${claimantFirstName}'s email address`}
            name="claimantEmail"
            type="email"
            value={localData.claimantEmail || ''}
            onChange={handleFieldChange}
            error={errors.claimantEmail}
            forceShowError={formSubmitted}
            required
            schema={claimantEmailSchema}
          />
        </>
      )}
    </PageTemplate>
  );
};

ClaimantContactPage.propTypes = {
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  onReviewPage: PropTypes.bool,
  goForward: PropTypes.func.isRequired,
  goBack: PropTypes.func,
  setFormData: PropTypes.func,
  updatePage: PropTypes.func,
};
