import React, { useState } from 'react';

const deviceNameField = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [isChecked, setIsChecked] = useState(false);

  return (
    <>
      <p className="vads-u-font-size--md vads-u-font-weight--bold">
        OMEGA XD3241
      </p>
      <p>Prescribed 1/10/2018</p>
      <div className="vads-u-border-left--10px vads-u-border-color--primary-alt">
        <div className="usa-alert-body mdot-alert-body">
          <p className="vads-u-margin--1px">
            <span className="vads-u-font-weight--bold">Battery:</span> ZA1234
          </p>
          <p className="vads-u-margin--1px">
            <span className="vads-u-font-weight--bold">Quantity:</span> 80
            (Approximately 6 months supply)
          </p>
          <p className="vads-u-margin--1px">
            <span className="vads-u-font-weight--bold">Last order date:</span>{' '}
            05/05/2019
          </p>
        </div>
      </div>
      <div
        className={
          !isChecked
            ? 'vads-u-background-color--white vads-u-color--link-default button-dimensions vads-u-border-color--primary vads-u-border--2px'
            : 'vads-u-background-color--primary button-dimensions vads-u-color--white vads-u-border-color--primary vads-u-border--2px'
        }
      >
        <input
          name="product-id-1"
          type="checkbox"
          onChange={event => setIsChecked(event.currentTarget.checked)}
          checked={isChecked}
        />
        <label htmlFor="product-id-1" className="main">
          Order batteries for this device
        </label>
      </div>
    </>
  );
};

export default deviceNameField;
