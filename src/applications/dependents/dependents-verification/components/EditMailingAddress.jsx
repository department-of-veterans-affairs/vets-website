import React, { useEffect } from 'react';
import { SchemaForm } from 'platform/forms-system/exportsFile';
import { VaButton } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';
import { scrollTo } from 'platform/utilities/scroll';

const EditMailingAddress = ({
  data,
  schema,
  uiSchema,
  goToPath,
  setFormData,
  contentBeforeButtons,
  contentAfterButtons,
}) => {
  const fromReviewPage = sessionStorage.getItem('onReviewPage');

  const returnPath = '/veteran-contact-information';
  const mailingAddress = data?.veteranContactInformation?.mailingAddress || {};
  // Convert profile address data to address schema format
  const address = {
    addressType: mailingAddress?.addressType || '',
    country: mailingAddress?.countryCodeIso3 || '',
    isMilitary: (mailingAddress?.addressType || '').includes('MILITARY'),
    street: mailingAddress?.addressLine1 || '',
    street2: mailingAddress?.addressLine2 || '',
    street3: mailingAddress?.addressLine3 || '',
    city: mailingAddress?.city || '',
    state: mailingAddress?.stateCode || '',
    postalCode: mailingAddress?.zipCode || '',
    internationalPostalCode: mailingAddress?.internationalPostalCode || '',
  };

  const returnToPath = () => {
    goToPath(fromReviewPage ? '/review-and-submit' : returnPath);
  };

  const handlers = {
    onInput: inputData => {
      const isUSA =
        !inputData.address.country || inputData.address.country === 'USA';
      let addressType = 'DOMESTIC';
      if (inputData.address.isMilitary) {
        addressType = 'MILITARY';
      } else if (!isUSA) {
        addressType = 'INTERNATIONAL';
      }
      setFormData({
        ...data,
        test: true,
        veteranContactInformation: {
          ...data.veteranContactInformation,
          mailingAddress: {
            ...mailingAddress,
            countryCodeIso3: inputData.address.country,
            addressType,
            addressLine1: inputData.address.street,
            addressLine2: inputData.address.street2,
            addressLine3: inputData.address.street3,
            city: inputData.address.city,
            stateCode: isUSA ? inputData.address.state : '',
            province: isUSA ? '' : inputData.address.state,
            internationalPostalCode: isUSA ? '' : inputData.address.postalCode,
            zipCode: isUSA ? inputData.address.postalCode : '',
          },
        },
      });
    },
    onSubmit: () => {
      returnToPath();
    },
    onCancel: () => {
      returnToPath();
    },
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      scrollTo('topScrollElement');
    }, 250);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      <va-alert status="info" slim class="vads-u-margin-y--3">
        <p className="vads-u-margin--0">
          <strong>Note:</strong> We’ve prefilled some of your information. If
          you need to make changes, you can edit on this screen. Your changes
          won’t affect your VA.gov profile.
        </p>
      </va-alert>
      <h3 className="vads-u-margin-bottom--4">Edit mailing address</h3>
      <SchemaForm
        addNameAttribute
        // `name` and `title` are required by SchemaForm, but are only used
        // internally by the SchemaForm component
        name="Contact Info Form"
        title="Contact Info Form"
        idSchema={{}}
        schema={schema}
        data={{ address }}
        uiSchema={uiSchema}
        onChange={handlers.onInput}
        onSubmit={handlers.onSubmit}
      >
        {contentBeforeButtons}
        <div className="vads-u-margin-y--2">
          <VaButton text="Save" submit="prevent" />
          <VaButton text="Cancel" onClick={handlers.onCancel} secondary />
        </div>
        {contentAfterButtons}
      </SchemaForm>
    </>
  );
};

EditMailingAddress.propTypes = {
  data: PropTypes.object.isRequired,
  goBack: PropTypes.func.isRequired,
  goToPath: PropTypes.func.isRequired,
  schema: PropTypes.object.isRequired,
  setFormData: PropTypes.func.isRequired,
  uiSchema: PropTypes.object.isRequired,
  contentAfterButtons: PropTypes.node,
  contentBeforeButtons: PropTypes.node,
};

export default EditMailingAddress;
