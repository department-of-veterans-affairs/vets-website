import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

function ReceiveTextMessages({ options, value, disabled, onChange, id, user }) {
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

  const [noMobilePhone, setNoMobilePhone] = useState(true);
  const [mobileIsInternational, setMobileIsInternational] = useState(true);

  // dummy logic, will update
  if (user === undefined) {
    setMobileIsInternational(false);
    setNoMobilePhone(false);
  }

  const captureMobilePhone = (
    <>
      <va-alert close-btn-aria-label="Close notification" status="info" visible>
        <h2 id="track-your-status-on-mobile" slot="headline">
          We’ll need a mobile phone number to send you text message
          notifications
        </h2>
      </va-alert>
      <div>
        <va-text-input
          hint={null}
          label="Mobile phone number"
          name="my-input"
          onBlur={function noRefCheck() {}}
          onInput={function noRefCheck() {}}
          required
        />
      </div>
    </>
  );

  return (
    <div>
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
        noMobilePhone &&
        mobileIsInternational &&
        captureMobilePhone}

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
    </div>
  );
}

ReceiveTextMessages.propTypes = {
  user: PropTypes.object,
  options: PropTypes.object,
  value: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  id: PropTypes.string,
};

const mapStateToProps = state => ({
  user: state.user || {},
});

export default connect(
  mapStateToProps,
  null,
)(ReceiveTextMessages);
