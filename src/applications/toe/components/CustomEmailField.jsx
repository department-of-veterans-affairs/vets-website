import React, { useEffect, useRef, useState } from 'react';
import { setData } from 'platform/forms-system/src/js/actions';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { isValidEmail } from 'platform/forms/validations';
import EmailWidget from 'platform/forms-system/src/js/widgets/EmailWidget';

import { fetchDuplicateContactInfo, updateGlobalEmail } from '../actions';
import { prefillTransformer } from '../helpers';

function CustomEmailField(props) {
  const hasSyncedRef = useRef(false);
  // Track the user's local input value separately from form state
  const [localValue, setLocalValue] = useState(null);

  // Sync prefilled email to form state on mount so confirmEmail also gets populated.
  // Only sync once, and only before user has interacted.
  useEffect(
    () => {
      if (
        props.prefillEmail &&
        !props.formEmail &&
        !hasSyncedRef.current &&
        localValue === null
      ) {
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
      props.formData,
      props.setFormData,
      localValue,
    ],
  );

  // Determine display value: use local value if user has edited, otherwise form/prefill
  const displayValue =
    localValue !== null ? localValue : props.formEmail ?? props.prefillEmail;

  function handleChange(event) {
    // Track locally so we don't lose the value if form state resets
    setLocalValue(event);

    if (props.email !== event) {
      props.setFormData({
        ...props?.formData,
        email: {
          ...props?.formData?.email,
          email: event,
        },
      });
    }

    const mobilePhone = props?.mobilePhone ? props?.mobilePhone : '';
    if (event && isValidEmail(event)) {
      props.fetchDuplicateContactInfo(
        [{ value: event, dupe: '' }],
        [{ value: mobilePhone, dupe: '' }],
      );
    } else {
      props.setFormData({
        ...props?.formData,
        email: {
          ...props?.formData?.email,
          email: event,
        },
      });
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
  const prefillEmail = prefillTransformer(null, null, null, state)?.formData
    ?.email?.email;

  return {
    formEmail,
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
