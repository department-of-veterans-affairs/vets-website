import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';

function ReceiveTextMessages({
  options,
  value,
  disabled,
  onChange,
  id,
  formData,
}) {
  const {
    enumOptions,
    labels = {},
    widgetProps = {},
    selectedProps = {},
  } = options;

  const getProps = (key, checked) => ({
    ...(widgetProps[key] || {}),
    ...((checked && selectedProps[key]) || {}),
  });

  const errorMessages = { required: 'Please provide a response' };

  const [hasMobilePhone, setHasMobilePhone] = useState(false);
  const [mobileIsInternational, setMobileIsInternational] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [newMobilePhone, setNewMobilePhone] = useState(false);

  const handleInput = useCallback(
    event => {
      formData['view:phoneNumbers'].mobilePhoneNumber.phone = // eslint-disable-line no-param-reassign
        event.target.value;
    },
    [newMobilePhone],
  );

  const handleBlur = event => {
    setDirty(true);
    setNewMobilePhone(event.nativeEvent.data);
  };

  let showError;

  useEffect(
    () => {
      setMobileIsInternational(
        !!formData['view:phoneNumbers']?.mobilePhoneNumber?.isInternational,
      );
      setHasMobilePhone(
        !!formData['view:phoneNumbers']?.mobilePhoneNumber?.phone,
      );
      showError = dirty && !value ? errorMessages.required : false;
    },
    [dirty, hasMobilePhone, mobileIsInternational],
  );

  return (
    <>
      <div className="form-radio-buttons" key={enumOptions[0].value}>
        <input
          type="radio"
          checked={enumOptions[0].value === value}
          autoComplete="off"
          id={`${id}_0`}
          name={`${id}`}
          value={enumOptions[0].value}
          disabled={disabled}
          onChange={_ => onChange(enumOptions[0].value)}
          {...getProps(enumOptions[0].value, enumOptions[0].value === value)}
        />
        <label htmlFor={`${id}_0`}>
          {labels[enumOptions[0].value] || enumOptions[0].label}
        </label>
      </div>

      {enumOptions[0].value === value &&
        (!hasMobilePhone || mobileIsInternational) && (
          <>
            <va-alert
              background-only
              show-icon
              close-btn-aria-label="Close notification"
              status="info"
              visible
            >
              We’ll need a mobile phone number to send you text message
              notifications
            </va-alert>
            <va-text-input
              hint={null}
              type="tel"
              error={showError}
              label="Mobile phone number"
              name="my-input"
              onBlur={handleBlur}
              onInput={handleInput}
              required
            />
          </>
        )}

      <div className="form-radio-buttons" key={enumOptions[1].value}>
        <input
          type="radio"
          checked={enumOptions[1].value === value}
          autoComplete="off"
          id={`${id}_1`}
          name={`${id}`}
          value={enumOptions[1].value}
          disabled={disabled}
          onChange={_ => onChange(enumOptions[1].value)}
          {...getProps(enumOptions[1].value, enumOptions[1].value === value)}
        />
        <label htmlFor={`${id}_1`}>
          {labels[enumOptions[1].value] || enumOptions[1].label}
        </label>
      </div>
    </>
  );
}

ReceiveTextMessages.propTypes = {
  disabled: PropTypes.bool,
  formData: PropTypes.shape({}),
  id: PropTypes.string,
  onChange: PropTypes.func,
  options: PropTypes.object,
  user: PropTypes.object,
  value: PropTypes.string,
};

const mapStateToProps = state => ({
  user: state.user || {},
  formData: state.form?.data || {},
});

const mapDispatchToProps = {
  setFormData: setData,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ReceiveTextMessages);
