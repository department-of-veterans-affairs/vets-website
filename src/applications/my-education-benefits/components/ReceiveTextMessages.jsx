import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router';

function ReceiveTextMessages({ options, value, onChange, id, formData }) {
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

  useEffect(
    () => {
      setHasMobilePhone(
        !!formData['view:phoneNumbers']?.mobilePhoneNumber?.phone,
      );
    },
    [hasMobilePhone, formData, history],
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
        !hasMobilePhone && (
          <>
            <va-alert
              background-only
              close-btn-aria-label="Close notification"
              show-icon
              status="warning"
              visible
            >
              <div>
                <p className="vads-u-margin-y--0">
                  We can't send you text message notifications because we don’t
                  have a mobile phone number on file for you
                </p>

                <Link
                  aria-label="go back and add any missing issues for review"
                  to={{
                    pathname: 'contact-information/email-phone',
                    search: '?redirect',
                  }}
                >
                  <va-button
                    onClick={() => {}}
                    secondary
                    text="Go back and add a mobile phone number"
                  />
                </Link>
              </div>
            </va-alert>
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
  options: PropTypes.object,
  user: PropTypes.object,
  value: PropTypes.string,
};

const mapStateToProps = state => ({
  user: state.user || {},
  formData: state.form?.data || {},
});

export default connect(
  mapStateToProps,
  null,
)(ReceiveTextMessages);
