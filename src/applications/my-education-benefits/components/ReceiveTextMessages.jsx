import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';

function ReceiveTextMessages({
  options,
  value,
  onChange,
  id,
  formData,
  handlePhoneOnChange,
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

  const [hasMobilePhone, setHasMobilePhone] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [showError, setShowError] = useState('');

  const handleInput = useCallback(
    event => {
      formData['view:phoneNumbers'].mobilePhoneNumber.phone = // eslint-disable-line no-param-reassign
        event.target.value;

      setDirty(true);
      handlePhoneOnChange(event.target.value);
    },
    [formData],
  );

  // const handleBlur = event => {
  //   setDirty(true);
  //   setNewMobilePhone(event.nativeEvent.data);
  // };

  const handleError = () => {
    const pattern = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;

    if (formData['view:phoneNumbers']?.mobilePhoneNumber?.phone?.length < 10) {
      setShowError(
        'Please enter a 10-digit phone number (with or without dashes)',
      );
    } else {
      setShowError('');
    }

    if (!pattern.test(formData['view:phoneNumbers'].mobilePhoneNumber.phone)) {
      setShowError(
        'Please enter a 10-digit phone number (with or without dashes)',
      );
    } else {
      setShowError(undefined);
    }
  };

  useEffect(
    () => {
      setHasMobilePhone(
        !!formData['view:phoneNumbers']?.mobilePhoneNumber?.phone,
      );

      handleError();
    },
    [dirty, hasMobilePhone],
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
          onChange={_ => onChange(enumOptions[0].value)}
          {...getProps(enumOptions[0].value, enumOptions[0].value === value)}
        />
        <label htmlFor={`${id}_0`}>
          {labels[enumOptions[0].value] || enumOptions[0].label}
        </label>
      </div>

      {enumOptions[0].value === value &&
        (!hasMobilePhone || showError) && (
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
              onBlur={handleError}
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
  formData: PropTypes.shape({}),
  id: PropTypes.string,
  onChange: PropTypes.func,
  handlePhoneOnChange: PropTypes.func,
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
