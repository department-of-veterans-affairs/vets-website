import PropTypes from 'prop-types';
import React from 'react';

import { TextInputField } from '@bio-aquia/shared/components/atoms';
import { AddressField } from '@bio-aquia/shared/components/molecules';
import { PageTemplate } from '@bio-aquia/shared/components/templates';

import {
  employerAddressSchema,
  employerInformationSchema,
  employerNameSchema,
} from '../../schemas';

/**
 * Employer Information page component for the employment information form
 * This page collects employer's name and address
 * @param {Object} props - Component props
 * @param {Object} props.data - Initial form data
 * @param {Function} props.setFormData - Function to update form data
 * @param {Function} props.goForward - Function to proceed to next page
 * @param {Function} props.goBack - Function to go to previous page
 * @returns {JSX.Element} Employer information form page
 */
export const EmployerInformationPage = ({
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
      title="Employer's name and address"
      data={formDataToUse}
      setFormData={setFormData}
      goForward={goForward}
      goBack={goBack}
      schema={employerInformationSchema}
      sectionName="employerInformation"
      onReviewPage={onReviewPage}
      updatePage={updatePage}
      defaultData={{
        employerName: '',
        employerAddress: {
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
          <TextInputField
            name="employerName"
            label="Name of employer"
            value={localData.employerName}
            onChange={handleFieldChange}
            error={errors.employerName}
            forceShowError={formSubmitted}
            schema={employerNameSchema}
            required
            maxlength={100}
          />

          <AddressField
            name="employerAddress"
            label="Employer's address"
            value={localData.employerAddress}
            onChange={handleFieldChange}
            schema={employerAddressSchema}
            errors={
              formSubmitted && errors.employerAddress
                ? {
                    street:
                      errors.employerAddress.street ||
                      errors.employerAddress?.street,
                    street2:
                      errors.employerAddress.street2 ||
                      errors.employerAddress?.street2,
                    city:
                      errors.employerAddress.city ||
                      errors.employerAddress?.city,
                    state:
                      errors.employerAddress.state ||
                      errors.employerAddress?.state,
                    country:
                      errors.employerAddress.country ||
                      errors.employerAddress?.country,
                    postalCode:
                      errors.employerAddress.postalCode ||
                      errors.employerAddress?.postalCode,
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

EmployerInformationPage.propTypes = {
  goForward: PropTypes.func.isRequired,
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  goBack: PropTypes.func,
  setFormData: PropTypes.func,
  updatePage: PropTypes.func,
  onReviewPage: PropTypes.bool,
};

export default EmployerInformationPage;
