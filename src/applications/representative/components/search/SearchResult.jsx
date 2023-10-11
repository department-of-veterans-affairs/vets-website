import React from 'react';
import PropTypes from 'prop-types';
import { browserHistory } from 'react-router';

const SearchResult = ({ name, type, address, phone }) => {
  const redirectToForm = () => {
    browserHistory.push('/representative/form/introduction');
  };

  return (
    <>
      <div className="representative-result">
        <div className="primary">
          <b>{name}</b> - {type}
        </div>
        <div>{address}</div>
        <div className="primary">{phone}</div>
        <va-button onClick={redirectToForm} text="Select" />
        <div className="va-h-ruled" />
        <input id="facility-search" type="submit" value="Search" />
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
