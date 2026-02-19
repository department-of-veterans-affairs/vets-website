import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { SchemaForm, FormNavButtons } from 'platform/forms-system/exportsFile';
import { isValidEmail } from 'platform/forms/validations';
import { fetchDuplicateContactInfo } from '../actions';

const PhoneAndEmailPage = props => {
  const {
    name,
    title,
    schema,
    uiSchema,
    data,
    onChange,
    onSubmit,
    goBack,
    contentBeforeButtons,
    contentAfterButtons,
    trackingPrefix,
    formContext,
    getDuplicateContactInfo,
  } = props;

  const checkDuplicate = () => {
    const emailUpdated =
      data?.duplicateEmail?.length > 0 &&
      !data?.duplicateEmail?.some(
        entry => entry?.address === data?.contactInfo?.emailAddress,
      );
    const phoneUpdated =
      data?.duplicatePhone?.length > 0 &&
      !data?.duplicatePhone?.some(
        entry => entry?.number === data?.contactInfo?.mobilePhone?.contact,
      );

    if (
      isValidEmail(data?.contactInfo?.emailAddress) &&
      data?.contactInfo?.mobilePhone?.isValid &&
      (emailUpdated || phoneUpdated)
    ) {
      getDuplicateContactInfo(
        [{ value: data?.contactInfo?.emailAddress, dupe: '' }],
        [{ value: data?.contactInfo?.mobilePhone?.contact, dupe: '' }],
      );
    }
  };

  // Check for duplicates on initial page load
  useEffect(() => {
    checkDuplicate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Check for duplicates when email or mobile phone changes
  useEffect(
    () => {
      const emailInput = document.querySelector('va-text-input[label="Email"]');
      const mobilePhoneInput = document.querySelector(
        'va-telephone-input[label="Mobile phone number"]',
      );

      if (!emailInput || !mobilePhoneInput) return undefined;

      emailInput.addEventListener('blur', checkDuplicate);
      mobilePhoneInput.addEventListener('blur', checkDuplicate);

      return () => {
        emailInput.removeEventListener('blur', checkDuplicate);
        mobilePhoneInput.removeEventListener('blur', checkDuplicate);
      };
    },
    [data, checkDuplicate],
  );

  return (
    <SchemaForm
      name={name}
      title={title}
      schema={schema}
      data={data}
      uiSchema={uiSchema}
      onChange={onChange}
      onSubmit={onSubmit}
      trackingPrefix={trackingPrefix}
      formContext={formContext}
    >
      {contentBeforeButtons}
      <FormNavButtons goBack={goBack} submitToContinue />
      {contentAfterButtons}
    </SchemaForm>
  );
};

const mapDispatchToProps = {
  getDuplicateContactInfo: fetchDuplicateContactInfo,
};

export default connect(
  null,
  mapDispatchToProps,
)(PhoneAndEmailPage);
