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
  // Only sync once - tracked by emailPrefillComplete flag in form state.
  useEffect(
    () => {
      const shouldSync =
        props.prefillEmail &&
        !props.emailPrefillComplete &&
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
          emailPrefillComplete: true,
        });
      }
    },
    [
      props.prefillEmail,
      props.emailPrefillComplete,
      props.formData,
      props.setFormData,
    ],
  );

  // Use local value if user has edited, otherwise use form state only
  const displayValue =
    localValue !== undefined ? localValue : props.formEmail ?? '';

  function handleChange(event) {
    setLocalValue(event);

    props.setFormData({
      ...props?.formData,
      email: {
        ...props?.formData?.email,
        email: event,
      },
    });

    const mobilePhone = props?.mobilePhone ?? '';
    if (event && isValidEmail(event)) {
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
  const emailPrefillComplete = state?.form?.data?.emailPrefillComplete;
  const prefillEmail = prefillTransformer(null, null, null, state)?.formData
    ?.email?.email;

  return {
    formEmail,
    emailPrefillComplete,
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
