import React from 'react';
import PropTypes from 'prop-types';

const SearchResult = ({ name, type, address, phone, onSelect }) => {
  return (
    <>
      <div className="representative-result">
        <div className="primary">
          <b>{name}</b> - {type}
        </div>
        <div>{address}</div>
        <div className="primary">{phone}</div>
        <va-button onClick={() => onSelect()} text="Select" />
        <div className="va-h-ruled" />
      </div>
    </>
  );
};

SearchResult.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  address: PropTypes.string.isRequired,
  phone: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default SearchResult;
