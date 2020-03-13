import React, { useState } from 'react';

const addressFields = () => {
  /* eslint-disable react-hooks/rules-of-hooks */
  const [isPermChecked, setIsPermChecked] = useState(true);
  const [isTempChecked, setIsTempChecked] = useState(false);
  return (
    <>
      <p className="vads-u-font-weight--bold">Shipping address</p>
      <p>
        Your order will ship to this address. Orders typically arrive with 7-10
        business days.
      </p>
      <p className="vads-u-font-weight--bold">
        Select the address you would like us to send your order to:{' '}
        <span className="red vads-u-font-weight--normal">*(Required)</span>
      </p>
      <div className="order-background">
        <p className="vads-u-font-weight--bold">Permanent Address</p>
        <div className="vads-u-border-left--10px vads-u-border-color--primary-alt">
          <div className="usa-alert-body mdot-alert-body">
            <p className="vads-u-margin--1px">
              <span>7717 S Fitzgerald St</span>
            </p>
            <p className="vads-u-margin--1px">
              <span>Tampa, FL 33616</span>
            </p>
            <p className="vads-u-margin--1px">
              <span>United States</span>
            </p>
          </div>
        </div>
        <a href="#" onClick>
          Edit permanent address
        </a>
        <div
          className={
            !isPermChecked
              ? 'vads-u-background-color--white vads-u-color--primary button-dimensions vads-u-border-color--primary vads-u-border--2px'
              : 'vads-u-background-color--primary button-dimensions vads-u-color--white vads-u-border-color--primary vads-u-border--2px'
          }
        >
          <input
            name="permAddress"
            type="radio"
            onChange={event => {
              setIsPermChecked(event.target.checked);
              setIsTempChecked(!event.target.checked);
            }}
            checked={isPermChecked}
          />
          <label
            htmlFor="product-id-1"
            className="main vads-u-font-weight--bold"
          >
            Send to this address
          </label>
        </div>
      </div>
      <div className="order-background">
        <p className="vads-u-font-weight--bold">Temporary Address</p>
        <div className="vads-u-border-left--10px vads-u-border-color--primary-alt">
          <div className="usa-alert-body mdot-alert-body">
            <p className="vads-u-margin--1px">
              <span>1234 W Nebraska St</span>
            </p>
            <p className="vads-u-margin--1px">
              <span>Tampa, FL 33616</span>
            </p>
            <p className="vads-u-margin--1px">
              <span>United States</span>
            </p>
          </div>
        </div>
        <a href="#">Edit temporary address</a>
        <div
          className={
            !isTempChecked
              ? 'vads-u-background-color--white vads-u-color--primary button-dimensions vads-u-border-color--primary vads-u-border--2px'
              : 'vads-u-background-color--primary button-dimensions vads-u-color--white vads-u-border-color--primary vads-u-border--2px'
          }
        >
          <input
            name="tempAddress"
            type="radio"
            onChange={event => {
              setIsTempChecked(event.target.checked);
              setIsPermChecked(!event.target.checked);
            }}
            checked={isTempChecked}
          />
          <label
            htmlFor="product-id-1"
            className="main vads-u-font-weight--bold"
          >
            Send to this address
          </label>
        </div>
      </div>
    </>
  );
};

export default addressFields;
