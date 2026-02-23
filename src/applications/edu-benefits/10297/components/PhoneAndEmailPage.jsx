import React, { useCallback, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { SchemaForm, FormNavButtons } from 'platform/forms-system/exportsFile';
import { isValidEmail } from 'platform/forms/validations';
import { fetchDuplicateContactInfo } from '../actions';

const PhoneAndEmailPage = ({
  name,
  title,
  schema,
  uiSchema,
  data,
  onSubmit,
  goBack,
  contentBeforeButtons,
  contentAfterButtons,
  trackingPrefix,
  formContext,
  getDuplicateContactInfo,
  setFormData,
  onReviewPage,
  updatePage,
}) => {
  const handleChange = newData => {
    setFormData(newData);
  };

  const checkDuplicate = useCallback(
    () => {
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

      const isEmailValid =
        !document
          .querySelector("va-text-input[label='Email']")
          ?.hasAttribute('error') &&
        isValidEmail(data?.contactInfo?.emailAddress);

      if (
        isEmailValid &&
        data?.contactInfo?.mobilePhone?.isValid &&
        (emailUpdated || phoneUpdated)
      ) {
        getDuplicateContactInfo(
          [{ value: data?.contactInfo?.emailAddress, dupe: '' }],
          [{ value: data?.contactInfo?.mobilePhone?.contact, dupe: '' }],
        );
      } else if (isEmailValid && emailUpdated) {
        getDuplicateContactInfo(
          [{ value: data?.contactInfo?.emailAddress, dupe: '' }],
          [{ value: '', dupe: '' }],
        );
      } else if (data?.contactInfo?.mobilePhone?.isValid && phoneUpdated) {
        getDuplicateContactInfo(
          [{ value: '', dupe: '' }],
          [{ value: data?.contactInfo?.mobilePhone?.contact, dupe: '' }],
        );
      }
    },
    [data, getDuplicateContactInfo],
  );

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
      onChange={handleChange}
      onSubmit={onSubmit}
      trackingPrefix={trackingPrefix}
      formContext={formContext}
    >
      {contentBeforeButtons}
      {onReviewPage ? (
        <va-button
          full-width
          type="submit"
          text="Update page"
          class="vads-u-padding--0"
          label={`Update ${title}`}
          onClick={updatePage}
        />
      ) : (
        <FormNavButtons goBack={goBack} submitToContinue />
      )}
      {contentAfterButtons}
    </SchemaForm>
  );
};

const mapDispatchToProps = {
  getDuplicateContactInfo: fetchDuplicateContactInfo,
};

PhoneAndEmailPage.propTypes = {
  contentAfterButtons: PropTypes.node,
  contentBeforeButtons: PropTypes.node,
  data: PropTypes.object,
  formContext: PropTypes.object,
  getDuplicateContactInfo: PropTypes.func,
  goBack: PropTypes.func,
  name: PropTypes.string,
  schema: PropTypes.object,
  setFormData: PropTypes.func,
  title: PropTypes.string,
  trackingPrefix: PropTypes.string,
  uiSchema: PropTypes.object,
  updatePage: PropTypes.func,
  onChange: PropTypes.func,
  onReviewPage: PropTypes.bool,
  onSubmit: PropTypes.func,
};

export default connect(
  null,
  mapDispatchToProps,
)(PhoneAndEmailPage);
