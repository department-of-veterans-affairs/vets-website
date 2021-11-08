import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

export const DynamicPhoneRadioWidget = props => {
  const { onChange, id, disabled } = props;
  const [enums, setEnums] = useState([
    'Email',
    'Home Phone',
    'Mobile Phone',
    'Mail',
  ]);

  useEffect(
    () => {
      const {
        mobilePhoneNumber: { phone: mPhone },
        phoneNumber: { phone: hPhone },
      } = props.phone;

      if (!mPhone && hPhone) {
        setEnums(['Email', 'Home Phone', 'Mail']);
      } else if (!hPhone && mPhone) {
        setEnums(['Email', 'Mobile Phone', 'Mail']);
      } else if (!hPhone && !mPhone) {
        setEnums(['Email', 'Mail']);
      }
    },
    [props.phone],
  );

  return (
    <>
      {enums.map((curr, index) => {
        const checked = curr === props.value;
        return (
          <div className="form-radio-buttons" key={curr}>
            <input
              type="radio"
              checked={checked}
              id={`${id}_${index}`}
              name={`${id}`}
              value={curr}
              disabled={disabled}
              onChange={_ => onChange(curr)}
            />
            <label htmlFor={`${id}_${index}`}>{curr}</label>
          </div>
        );
      })}
    </>
  );
};

function mapStateToProps(state) {
  return {
    phone: state?.form?.data['view:phoneNumbers'],
  };
}

export default connect(
  mapStateToProps,
  null,
)(DynamicPhoneRadioWidget);
