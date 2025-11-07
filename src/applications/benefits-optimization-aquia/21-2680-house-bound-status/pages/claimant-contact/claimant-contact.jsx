import PropTypes from 'prop-types';
import React from 'react';

import { PageTemplateWithSaveInProgress } from '@bio-aquia/shared/components/templates';
import { PhoneField, TextInputField } from '@bio-aquia/shared/components/atoms';

import {
  claimantPhoneNumberSchema,
  claimantMobilePhoneSchema,
  claimantEmailSchema,
  claimantContactPageSchema,
} from '@bio-aquia/21-2680-house-bound-status/schemas';
import { formConfig } from '@bio-aquia/21-2680-house-bound-status/config/form';

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

  // Get claimant's name from form data
  const claimantName = formDataToUse?.claimantInformation?.claimantFullName;
  const firstName = claimantName?.first || '';
  const lastName = claimantName?.last || '';

  // Format the name for display
  const formattedName =
    firstName && lastName
      ? `${firstName} ${lastName}`
      : firstName || 'Claimant';

  const pageTitle = `${formattedName}'s phone number and email address`;

  return (
    <PageTemplateWithSaveInProgress
      title={pageTitle}
      data={formDataToUse}
      setFormData={setFormData}
      goForward={goForward}
      goBack={goBack}
      schema={claimantContactPageSchema}
      sectionName="claimantContact"
      onReviewPage={onReviewPage}
      updatePage={updatePage}
      formConfig={formConfig}
      defaultData={{
        claimantPhoneNumber: '',
        claimantMobilePhone: '',
        claimantEmail: '',
      }}
    >
      {({ localData, handleFieldChange, errors, formSubmitted }) => (
        <>
          <p>
            We may use their contact information to contact them if we have
            questions about their application or if we need more information.
          </p>

          <PhoneField
            label={`${formattedName}'s home phone number`}
            name="claimantPhoneNumber"
            value={localData.claimantPhoneNumber || ''}
            onChange={handleFieldChange}
            error={errors.claimantPhoneNumber}
            forceShowError={formSubmitted}
            required
            schema={claimantPhoneNumberSchema}
          />

          <PhoneField
            label={`${formattedName}'s mobile phone number`}
            name="claimantMobilePhone"
            value={localData.claimantMobilePhone || ''}
            onChange={handleFieldChange}
            error={errors.claimantMobilePhone}
            forceShowError={formSubmitted}
            schema={claimantMobilePhoneSchema}
          />

          <TextInputField
            label={`${formattedName}'s email address`}
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
    </PageTemplateWithSaveInProgress>
  );
};

ClaimantContactPage.propTypes = {
  goForward: PropTypes.func.isRequired,
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  onReviewPage: PropTypes.bool,
  goBack: PropTypes.func,
  setFormData: PropTypes.func,
  updatePage: PropTypes.func,
};
