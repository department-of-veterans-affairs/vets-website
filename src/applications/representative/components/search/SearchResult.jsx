import React from 'react';

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

export default SearchResult;
