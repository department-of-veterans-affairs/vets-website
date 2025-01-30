import React from 'react';
import PropTypes from 'prop-types';

const EditReviewSupplies = ({ defaultEditButton, formData, title }) => {
  const { chosenSupplies, supplies } = formData;

  const selectedIds = Object.entries(chosenSupplies || {})
    .filter(([_key, value]) => value)
    .map(([key]) => key);

  const selectedList = supplies.reduce((products, item) => {
    if (selectedIds.includes(String(item.productId))) {
      products.push(
        <div
          key={item.productId}
          className="vads-u-padding-y--2 vads-u-border-top--1px vads-u-border-color--gray-light"
        >
          {item.productName}
        </div>,
      );
    }
    return products;
  }, []);

  return (
    <>
      <div className="form-review-panel-page-header-row">
        <h4 className="form-review-panel-page-header vads-u-font-size--h5 vads-u-padding-bottom--2">
          {title}
        </h4>
        <div className="vads-u-justify-content--flex-end">
          {defaultEditButton({ label: `Edit ${title}` })}
        </div>
      </div>
      <div className="vads-u-margin-top--2 vads-u-border-bottom--1px vads-u-border-color--gray-light">
        {selectedList}
      </div>
    </>
  );
};

EditReviewSupplies.propTypes = {
  defaultEditButton: PropTypes.func,
  formData: PropTypes.shape({
    chosenSupplies: PropTypes.object,
    supplies: PropTypes.array,
  }),
  title: PropTypes.string,
};

export default EditReviewSupplies;
