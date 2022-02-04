import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

const SearchRepresentativeResult = ({ handleClick, option }) => {
  const customStyle = {
    maxWidth: 180,
  };

  const onClick = useCallback(
    () => {
      handleClick(option);
    },
    [handleClick, option],
  );

  return (
    <div className="vads-u-margin-bottom--1p5 vads-u-background-color--gray-lightest vads-u-padding--4">
      <p className="vads-u-margin-top--0 vads-u-font-size--h3 vads-u-font-family--serif vads-u-font-weight--bold">
        {option.name}
      </p>
      <p className="vads-u-font-weight--bold">{option.type}</p>
      <p>{option.address}</p>
      <p>
        {option.city}, {option.state} {option.postalCode}
      </p>
      <p className="vads-u-margin-bottom--4">Phone: {option.phone}</p>
      <div style={customStyle}>
        <button className="va-button-link" onClick={onClick} type="submit">
          Select this representative
        </button>
      </div>
    </div>
  );
};

SearchRepresentativeResult.propTypes = {
  handleClick: PropTypes.func,
  option: PropTypes.object,
};

export default SearchRepresentativeResult;
