import React from 'react';
import { connect } from 'react-redux';

const ReviewPageBatteries = ({ selectedProductInfo, batterySupplies }) => (
  <div>
    <div className="vads-u-display--flex vads-u-flex-direction--column vads-u-margin-bottom--2">
      <span className="vads-u-font-weight--bold">
        You have requested to receive batteries for the following hearing aids:
      </span>
      <span>
        ({selectedProductInfo?.length || 0} out of{' '}
        {batterySupplies?.length || 0} selected)
      </span>
    </div>
    <div className="vads-u-margin-bottom--3">
      {selectedProductInfo &&
        selectedProductInfo.map((product, index) => (
          <div
            key={`${product.productId}_${index}`}
            className="vads-u-background-color--gray-light-alt vads-u-width--full vads-u-padding--4 vads-u-display--flex vads-u-flex-direction--column vads-u-margin-bottom--1p5"
          >
            <h5 className="vads-u-font-size--h4 vads-u-margin-top--0">
              {product.deviceName}
            </h5>
            <span>
              {product.productName} batteries (Quantity: {product.quantity})
            </span>
          </div>
        ))}
    </div>
  </div>
);

const mapStateToProps = state => {
  const supplies = state.form?.data?.supplies;
  const selectedProducts = state.form?.data?.selectedProducts;
  const productIdArray = selectedProducts?.map(product => product.productId);
  const selectedProductInfo = supplies?.filter(supply =>
    productIdArray?.includes(supply.productId),
  );

  return {
    supplies,
    selectedProductInfo,
  };
};

export default connect(mapStateToProps)(ReviewPageBatteries);
