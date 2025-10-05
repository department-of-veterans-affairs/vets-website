import PropTypes from 'prop-types';
import React from 'react';

import {
  FormField,
  MemorableDateField,
  PhoneField,
} from '@bio-aquia/shared/components/atoms';
import { AddressField } from '@bio-aquia/shared/components/molecules';
import { PageTemplate } from '@bio-aquia/shared/components/templates';
import { transformDates } from '@bio-aquia/shared/forms';

import {
  cemeteryInformationSchema,
  cemeteryLocationSchema,
  cemeteryNameSchema,
  dateOfBurialSchema,
  organizationNameSchema,
  recipientAddressSchema,
  recipientNameSchema,
  recipientPhoneSchema,
} from '../schemas';

/**
 * Data processor to ensure date values are properly formatted strings
 */
const ensureDateStrings = formData => {
  return transformDates(formData, ['dateOfBurial']);
};

/**
 * Cemetery Information page component for the interment allowance form
 * This page collects cemetery and payment recipient information
 * @param {Object} props - Component props
 * @param {Object} props.data - Initial form data
 * @param {Function} props.setFormData - Function to update form data
 * @param {Function} props.goForward - Function to proceed to next page
 * @returns {JSX.Element} Cemetery information form page
 */
export const CemeteryInformationPage = ({
  data,
  setFormData,
  goForward,
  goBack,
}) => {
  const formDataToUse =
    data && typeof data === 'object' && !Array.isArray(data) ? data : {};

  return (
    <PageTemplate
      title="State cemetery or tribal organization information"
      data={formDataToUse}
      setFormData={setFormData}
      goForward={goForward}
      goBack={goBack}
      schema={cemeteryInformationSchema}
      sectionName="cemeteryInformation"
      dataProcessor={ensureDateStrings}
      defaultData={{
        organizationName: '',
        cemeteryName: '',
        cemeteryLocation: {
          city: '',
          state: '',
        },
        dateOfBurial: '',
        recipientOrganizationName: '',
        recipientPhone: '',
        recipientAddress: {
          street: '',
          street2: '',
          street3: '',
          city: '',
          state: '',
          country: 'USA',
          postalCode: '',
          isMilitary: false,
        },
      }}
    >
      {({ localData, handleFieldChange, errors, formSubmitted }) => (
        <>
          <p className="vads-u-margin-bottom--3">
            Please provide information about the cemetery and organization
            claiming the interment allowance.
          </p>

          <FormField
            name="organizationName"
            label="Name of state cemetery or tribal organization claiming interment allowance"
            value={localData.organizationName}
            onChange={handleFieldChange}
            required
            error={errors.organizationName}
            forceShowError={formSubmitted}
            schema={organizationNameSchema}
          />

          <va-fieldset className="vads-u-margin-y--2">
            <legend className="schemaform-block-title">
              Cemetery information
            </legend>

            <FormField
              name="cemeteryName"
              label="State cemetery or tribal cemetery name"
              value={localData.cemeteryName}
              onChange={handleFieldChange}
              required
              error={errors.cemeteryName}
              forceShowError={formSubmitted}
              schema={cemeteryNameSchema}
            />

            <FormField
              name="cemeteryLocation.city"
              label="Cemetery city"
              value={localData.cemeteryLocation?.city}
              onChange={handleFieldChange}
              required
              error={
                errors.cemeteryLocation?.city || errors['cemeteryLocation.city']
              }
              forceShowError={formSubmitted}
              schema={cemeteryLocationSchema.shape.city}
            />

            <FormField
              name="cemeteryLocation.state"
              label="Cemetery state"
              value={localData.cemeteryLocation?.state}
              onChange={handleFieldChange}
              required
              error={
                errors.cemeteryLocation?.state ||
                errors['cemeteryLocation.state']
              }
              forceShowError={formSubmitted}
              schema={cemeteryLocationSchema.shape.state}
            />
          </va-fieldset>

          <MemorableDateField
            name="dateOfBurial"
            label="Date of burial"
            schema={dateOfBurialSchema}
            value={localData.dateOfBurial}
            onChange={handleFieldChange}
            required
            error={errors.dateOfBurial}
            forceShowError={formSubmitted}
          />

          <va-alert status="info" show-icon class="vads-u-margin-y--2">
            <h3 slot="headline">Payment information</h3>
            <p>
              The following information is for the organization that will
              receive the interment allowance payment.
            </p>
          </va-alert>

          <FormField
            name="recipientOrganizationName"
            label="Recipient organization name (full name of payee)"
            value={localData.recipientOrganizationName}
            onChange={handleFieldChange}
            required
            error={errors.recipientOrganizationName}
            forceShowError={formSubmitted}
            schema={recipientNameSchema}
          />

          <PhoneField
            name="recipientPhone"
            label="Recipient organization phone number"
            schema={recipientPhoneSchema}
            value={localData.recipientPhone}
            onChange={handleFieldChange}
            required
            error={errors.recipientPhone}
            forceShowError={formSubmitted}
          />

          <AddressField
            name="recipientAddress"
            label="Recipient organization payee address"
            value={localData.recipientAddress}
            onChange={handleFieldChange}
            schema={recipientAddressSchema}
            errors={
              formSubmitted && errors.recipientAddress
                ? {
                    street:
                      errors.recipientAddress.street ||
                      errors.recipientAddress?.street,
                    street2:
                      errors.recipientAddress.street2 ||
                      errors.recipientAddress?.street2,
                    city:
                      errors.recipientAddress.city ||
                      errors.recipientAddress?.city,
                    state:
                      errors.recipientAddress.state ||
                      errors.recipientAddress?.state,
                    country:
                      errors.recipientAddress.country ||
                      errors.recipientAddress?.country,
                    postalCode:
                      errors.recipientAddress.postalCode ||
                      errors.recipientAddress?.postalCode,
                  }
                : {}
            }
            touched={
              formSubmitted
                ? {
                    street: true,
                    street2: true,
                    street3: true,
                    city: true,
                    state: true,
                    country: true,
                    postalCode: true,
                  }
                : {}
            }
            required
          />
        </>
      )}
    </PageTemplate>
  );
};

CemeteryInformationPage.propTypes = {
  goForward: PropTypes.func.isRequired,
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  goBack: PropTypes.func,
  setFormData: PropTypes.func,
};
