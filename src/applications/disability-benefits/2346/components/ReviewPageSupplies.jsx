import React from 'react';
import { connect } from 'react-redux';

const ReviewPageSupplies = ({
  batterySupplies,
  accessorySupplies,
  selectedBatteryProductInfo,
  selectedAccessoryProductInfo,
}) => (
  <>
    <dt className="vads-u-display--flex vads-u-flex-direction--column vads-u-margin-bottom--2">
      <span className="vads-u-font-weight--bold">
        You have requested to receive supplies for the following hearing aids:
      </span>
      <span>
        ({selectedBatteryProductInfo?.length || 0} out of{' '}
        {batterySupplies?.length || 0} selected)
      </span>
    </dt>
    <div className="vads-u-margin-bottom--3">
      {selectedBatteryProductInfo &&
        selectedBatteryProductInfo.map((product, index) => (
          <dd
            key={`${product.productId}_${index}`}
            className="vads-u-background-color--gray-light-alt vads-u-width--full vads-u-padding--4 vads-u-display--flex vads-u-flex-direction--column vads-u-margin-bottom--1p5"
          >
            <h5 className="vads-u-font-size--h4 vads-u-margin-top--0">
              {product.deviceName}
            </h5>
            <span>
              {product.productName} batteries (Quantity: {product.quantity})
            </span>
          </dd>
        ))}
    </div>
    <dd className="vads-u-display--flex vads-u-flex-direction--column vads-u-margin-bottom--2">
      <span className="vads-u-font-weight--bold">
        You have requested to receive the following accessories:
      </span>
      <span>
        ({selectedAccessoryProductInfo?.length || 0} out of{' '}
        {accessorySupplies?.length || 0} selected)
      </span>
    </dd>
    <div className="vads-u-margin-bottom--3">
      {selectedAccessoryProductInfo &&
        selectedAccessoryProductInfo.map((product, index) => (
          <dd
            key={`${product.productId}_${index}`}
            className="vads-u-background-color--gray-light-alt vads-u-width--full vads-u-padding--4 vads-u-display--flex vads-u-flex-direction--column vads-u-margin-bottom--1p5"
          >
            <h5 className="vads-u-font-size--h4 vads-u-margin-top--0">
              {product.productName}
            </h5>
            <span>Quantity: {product.quantity}</span>
          </dd>
        ))}
    </div>
  </>
);

const mapStateToProps = state => {
  const supplies = state.form?.data?.supplies;
  const batterySupplies = supplies?.filter(supply =>
    supply.productGroup?.includes('BATTERIES'),
  );
  const accessorySupplies = supplies?.filter(supply =>
    supply.productGroup?.includes('ACCESSORIES'),
  );
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
  };
};

export default connect(mapStateToProps)(ReviewPageSupplies);
