import React from 'react';
import PropTypes from 'prop-types';

const SearchResult = ({ name, type, address, phone, handleRedirect }) => {
  return (
    <>
      <div className="representative-result">
        <div className="primary">
          <b>{name}</b> - {type}
        </div>
        <div>{address}</div>
        <div className="primary">{phone}</div>
        <va-button onClick={e => handleRedirect(e)} text="Select" />
        <div className="va-h-ruled" />
      </div>
    </>
  );
};

SearchResult.propTypes = {
  address: PropTypes.string.isRequired,
  handleRedirect: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  phone: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

export default SearchResult;
