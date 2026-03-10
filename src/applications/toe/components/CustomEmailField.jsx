import React, { useEffect, useRef, useState } from 'react';
import { setData } from 'platform/forms-system/src/js/actions';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { isValidEmail } from 'platform/forms/validations';
import EmailWidget from 'platform/forms-system/src/js/widgets/EmailWidget';

import { fetchDuplicateContactInfo, updateGlobalEmail } from '../actions';
import { prefillTransformer } from '../helpers';

function CustomEmailField(props) {
  const [localValue, setLocalValue] = useState(undefined);
  const hasSyncedRef = useRef(false);

  // Sync prefilled email (including confirmEmail) to form state on mount.
  // Only sync if form email fields have never been touched.
  useEffect(
    () => {
      // If confirmEmail exists in form state, user has interacted - don't re-prefill
      const formHasBeenTouched = props.formConfirmEmail !== undefined;
      const shouldSync =
        props.prefillEmail &&
        props.formEmail === undefined &&
        !formHasBeenTouched &&
        !hasSyncedRef.current;

      if (shouldSync) {
        hasSyncedRef.current = true;
        props.setFormData({
          ...props.formData,
          email: {
            ...props.formData?.email,
            email: props.prefillEmail,
            confirmEmail: props.prefillEmail,
          },
        });
      }
    },
    [
      props.prefillEmail,
      props.formEmail,
      props.formConfirmEmail,
      props.formData,
      props.setFormData,
    ],
  );

  // Use local value if user has edited, otherwise use form state only
  const displayValue =
    localValue !== undefined ? localValue : props.formEmail ?? '';

  function handleChange(event) {
    setLocalValue(event);

    const mobilePhone = props?.mobilePhone ?? '';
    const emailIsValid = event && isValidEmail(event);

    // Update form data with the new email, and auto-fill confirmEmail if valid
    props.setFormData({
      ...props?.formData,
      email: {
        ...props?.formData?.email,
        email: event,
        ...(emailIsValid && { confirmEmail: event }),
      },
    });

    if (emailIsValid) {
      props.fetchDuplicateContactInfo(
        [{ value: event, dupe: '' }],
        [{ value: mobilePhone, dupe: '' }],
      );
    }
  }

  return (
    <EmailWidget {...props} onChange={handleChange} value={displayValue} />
  );
}

CustomEmailField.propTypes = {
  fetchDuplicateContactInfo: PropTypes.func,
  updateGlobalEmail: PropTypes.func,
  email: PropTypes.string,
};

const mapStateToProps = state => {
  const formEmail = state?.form?.data?.email?.email;
  const formConfirmEmail = state?.form?.data?.email?.confirmEmail;
  const prefillEmail = prefillTransformer(null, null, null, state)?.formData
    ?.email?.email;

  return {
    formEmail,
    formConfirmEmail,
    prefillEmail,
    duplicateEmail: state?.data?.duplicateEmail,
    mobilePhone:
      state?.form?.data['view:phoneNumbers']?.mobilePhoneNumber?.phone,
    formData: state?.form?.data,
  };
};

const mapDispatchToProps = {
  setFormData: setData,
  fetchDuplicateContactInfo,
  updateGlobalEmail,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CustomEmailField);
