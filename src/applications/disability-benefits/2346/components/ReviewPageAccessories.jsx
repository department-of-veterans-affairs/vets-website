import React from 'react';
import { connect } from 'react-redux';

const ReviewPageAccessories = ({ selectedProductInfo, accessorySupplies }) => (
  <div>
    <div className="vads-u-display--flex vads-u-flex-direction--column vads-u-margin-bottom--2">
      <span className="vads-u-font-weight--bold">
        You have requested to receive the following accessories:
      </span>
      <span>
        ({selectedProductInfo.length} out of {accessorySupplies.length}{' '}
        selected)
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
              {product.productName}
            </h5>
            <span>Quantity: {product.quantity}</span>
          </div>
        ))}
    </div>
  </div>
);

const mapStateToProps = state => {
  const supplies = state.form?.loadedData?.formData?.supplies;
  const accessorySupplies = supplies.filter(supply =>
    supply.productGroup.includes('accessories'),
  );
  const selectedProducts = state.form?.data?.selectedProducts;
  const productIdArray = selectedProducts.map(product => product.productId);
  const selectedProductInfo = accessorySupplies.filter(supply =>
    productIdArray.includes(supply.productId),
  );

  return {
    accessorySupplies,
    selectedProductInfo,
  };
};

export default connect(mapStateToProps)(ReviewPageAccessories);
