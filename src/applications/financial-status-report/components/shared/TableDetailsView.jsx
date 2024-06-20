import React from 'react';
import PropTypes from 'prop-types';
import { currency } from '../../utils/helpers';

const TableDetailsView = ({ formData, onEdit }) => {
  const values = formData && Object.values(formData);
  const keys = formData && Object.keys(formData);

  const format = value => {
    const isNumber = !isNaN(value);
    if (isNumber) {
      return currency(value);
    }
    return value;
  };

  const renderDetails = data => {
    return data?.map((key, i) => (
      <span
        key={`${key}-${i}`}
        className="vads-u-border--0 vads-u-border-bottom--1px"
      >
        {format(values[i])}
      </span>
    ));
  };

  return (
    <>
      {renderDetails(keys)}
      <span className="vads-u-border--0 vads-u-border-bottom--1px vads-u-text-align--right">
        <button
          className="usa-button-secondary vads-u-margin--0"
          onClick={() => onEdit()}
          type="button"
          // Add the form name to the aria-label if it exists
          aria-label={`Edit ${formData?.name ?? ''} `}
          tabIndex={0}
        >
          Edit
        </button>
      </span>
    </>
  );
};

TableDetailsView.propTypes = {
  formData: PropTypes.object,
  onEdit: PropTypes.func,
};

export default TableDetailsView;
