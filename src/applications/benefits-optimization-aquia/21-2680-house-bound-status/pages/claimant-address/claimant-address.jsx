import PropTypes from 'prop-types';
import React from 'react';

import { PageTemplate } from '@bio-aquia/shared/components/templates';
import { AddressField } from '@bio-aquia/shared/components/molecules';

import {
  claimantAddressPageSchema,
  claimantAddressSchema,
} from '@bio-aquia/21-2680-house-bound-status/schemas';

/**
 * Claimant Address Page
 * Collects claimant's mailing address
 * @module pages/claimant-address
 */
export const ClaimantAddressPage = ({
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
      title="Claimant address"
      data={formDataToUse}
      setFormData={setFormData}
      goForward={goForward}
      goBack={goBack}
      schema={claimantAddressPageSchema}
      sectionName="claimantAddress"
      onReviewPage={onReviewPage}
      updatePage={updatePage}
      defaultData={{
        claimantAddress: {
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
            name="claimantAddress"
            label="Claimant's mailing address"
            description="Enter your mailing address as the person filing on behalf of the Veteran."
            value={localData.claimantAddress}
            onChange={handleFieldChange}
            schema={claimantAddressSchema}
            errors={
              formSubmitted && errors.claimantAddress
                ? {
                    street:
                      errors.claimantAddress.street ||
                      errors.claimantAddress?.street,
                    street2:
                      errors.claimantAddress.street2 ||
                      errors.claimantAddress?.street2,
                    city:
                      errors.claimantAddress.city ||
                      errors.claimantAddress?.city,
                    state:
                      errors.claimantAddress.state ||
                      errors.claimantAddress?.state,
                    country:
                      errors.claimantAddress.country ||
                      errors.claimantAddress?.country,
                    postalCode:
                      errors.claimantAddress.postalCode ||
                      errors.claimantAddress?.postalCode,
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

ClaimantAddressPage.propTypes = {
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  onReviewPage: PropTypes.bool,
  goForward: PropTypes.func.isRequired,
  goBack: PropTypes.func,
  setFormData: PropTypes.func,
  updatePage: PropTypes.func,
};
