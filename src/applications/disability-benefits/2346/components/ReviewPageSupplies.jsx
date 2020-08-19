import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

const ReviewPageSupplies = ({
  batterySupplies,
  accessorySupplies,
  selectedBatteryProductInfo,
  selectedAccessoryProductInfo,
  eligibility,
  formContext,
}) => (
  <>
    <dt className="vads-u-display--flex vads-u-flex-direction--column vads-u-margin-bottom--2">
      <span className="vads-u-font-weight--bold">
        You have requested to receive supplies for the following hearing aids:
      </span>
      <span>
        ({selectedBatteryProductInfo?.length} out of {batterySupplies?.length}{' '}
        selected)
      </span>
      {!eligibility?.batteries && (
        <p className="vads-u-font-style--italic empty-state-ineligible-battery-text">
          You can't add batteries to your order at this time due to
          ineligibility.
        </p>
      )}
      {eligibility?.batteries &&
        selectedBatteryProductInfo?.length === 0 && (
          <div className="empty-state-eligible-battery-text">
            <p className="vads-u-font-style--italic vads-u-display--inline-block vads-u-margin-right--0p5">
              No batteries added.
            </p>
            <button
              className="va-button-link"
              onClick={() => formContext.onEdit()}
            >
              Add batteries to your order
            </button>
          </div>
        )}
    </dt>
    {eligibility?.batteries && (
      <div className="vads-u-margin-bottom--3">
        {selectedBatteryProductInfo &&
          selectedBatteryProductInfo.map((product, index) => (
            <dd
              key={`${product.productId}_${index}`}
              className="vads-u-background-color--gray-light-alt vads-u-width--full vads-u-padding--4 vads-u-display--flex vads-u-flex-direction--column vads-u-margin-bottom--1p5"
            >
              <h3 className="vads-u-font-size--h4 vads-u-margin-top--0">
                {product.deviceName}
              </h3>
              <span>
                {product.productName} batteries (Quantity: {product.quantity})
              </span>
            </dd>
          ))}
      </div>
    )}
    <dd className="vads-u-display--flex vads-u-flex-direction--column vads-u-margin-bottom--2">
      <span className="vads-u-font-weight--bold">
        You have requested to receive the following accessories:
      </span>
      <span>
        ({selectedAccessoryProductInfo?.length} out of{' '}
        {accessorySupplies?.length} selected)
      </span>
      {!eligibility?.accessories && (
        <p className="vads-u-font-style--italic empty-state-ineligible-accessory-text">
          You can't add accessories to your order at this time due to
          ineligibility.
        </p>
      )}
      {eligibility?.accessories &&
        selectedAccessoryProductInfo?.length === 0 && (
          <div className="empty-state-eligible-accessory-text">
            <p className="vads-u-font-style--italic vads-u-display--inline-block vads-u-margin-right--0p5">
              No accessories added.
            </p>
            <button
              className="va-button-link"
              onClick={() => formContext.onEdit()}
            >
              Add accessories to your order
            </button>
          </div>
        )}
    </dd>
    {eligibility?.accessories &&
      selectedAccessoryProductInfo?.length > 0 && (
        <div className="vads-u-margin-bottom--3">
          {selectedAccessoryProductInfo &&
            selectedAccessoryProductInfo.map((product, index) => (
              <dd
                key={`${product.productId}_${index}`}
                className="vads-u-background-color--gray-light-alt vads-u-width--full vads-u-padding--4 vads-u-display--flex vads-u-flex-direction--column vads-u-margin-bottom--1p5"
              >
                <h3 className="vads-u-font-size--h4 vads-u-margin-top--0">
                  {product.productName}
                </h3>
                <span>Quantity: {product.quantity}</span>
              </dd>
            ))}
        </div>
      )}
  </>
);

const mapStateToProps = (state, ownProps) => {
  const supplies = state.form?.data?.supplies;
  const batterySupplies = supplies
    ?.filter(battery => battery.productGroup?.includes('Battery'))
    .filter(battery => moment().diff(battery.nextAvailabilityDate) >= 0);
  const accessorySupplies = supplies
    ?.filter(accessory => accessory.productGroup?.includes('Accessory'))
    .filter(accessory => moment().diff(accessory.nextAvailabilityDate) >= 0);

  const order = state.form?.data?.order;
  const productIdArray = order?.map(product => product.productId);
  const selectedBatteryProductInfo = batterySupplies?.filter(supply =>
    productIdArray?.includes(supply.productId),
  );
  const selectedAccessoryProductInfo = accessorySupplies?.filter(supply =>
    productIdArray?.includes(supply.productId),
  );

  return {
    batterySupplies,
    accessorySupplies,
    selectedBatteryProductInfo,
    selectedAccessoryProductInfo,
    eligibility: state.form?.data?.eligibility,
    formContext: ownProps.formContext,
  };
};

export default connect(mapStateToProps)(ReviewPageSupplies);
