import PropTypes from 'prop-types';
import React from 'react';

import { PageTemplateWithSaveInProgress } from '@bio-aquia/shared/components/templates';
import { AddressField } from '@bio-aquia/shared/components/molecules';
import {
  veteranAddressPageSchema,
  veteranAddressSchema,
} from '@bio-aquia/21-2680-house-bound-status/schemas';
import { formConfig } from '@bio-aquia/21-2680-house-bound-status/config/form';

/**
 * Veteran Address Page
 * Collects veteran's mailing address
 * @module pages/veteran-address
 */
export const VeteranAddressPage = ({
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
    <PageTemplateWithSaveInProgress
      title="Veteran address"
      data={formDataToUse}
      setFormData={setFormData}
      goForward={goForward}
      goBack={goBack}
      schema={veteranAddressPageSchema}
      sectionName="veteranAddress"
      onReviewPage={onReviewPage}
      updatePage={updatePage}
      formConfig={formConfig}
      defaultData={{
        veteranAddress: {
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
          <AddressField
            name="veteranAddress"
            label="Veteran's mailing address"
            description="Enter the Veteran's mailing address."
            value={localData.veteranAddress}
            onChange={handleFieldChange}
            schema={veteranAddressSchema}
            errors={
              formSubmitted && errors.veteranAddress
                ? {
                    street:
                      errors.veteranAddress.street ||
                      errors.veteranAddress?.street,
                    street2:
                      errors.veteranAddress.street2 ||
                      errors.veteranAddress?.street2,
                    city:
                      errors.veteranAddress.city || errors.veteranAddress?.city,
                    state:
                      errors.veteranAddress.state ||
                      errors.veteranAddress?.state,
                    country:
                      errors.veteranAddress.country ||
                      errors.veteranAddress?.country,
                    postalCode:
                      errors.veteranAddress.postalCode ||
                      errors.veteranAddress?.postalCode,
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
    </PageTemplateWithSaveInProgress>
  );
};

VeteranAddressPage.propTypes = {
  goForward: PropTypes.func.isRequired,
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  goBack: PropTypes.func,
  setFormData: PropTypes.func,
  updatePage: PropTypes.func,
  onReviewPage: PropTypes.bool,
};
