import React from 'react';

const searchRepresentativeResult = props => {
  const customStyle = {
    maxWidth: 250,
  };
  return (
    <div className="vads-u-border-bottom--1px vads-u-padding--1p5 vads-u-border-color--gray-light">
      <p className="vads-u-font-size--h3 vads-u-font-family--serif vads-u-font-weight--bold">
        {props.option.name}
      </p>
      <p className="vads-u-font-weight--bold">{props.option.type}</p>
      <p>{props.option.address}</p>
      <p>{props.option.city}</p>
      <p>{props.option.phone}</p>
      <div style={customStyle}>
        <button
          onClick={() => props.handleClick(props.option.name)}
          className="usa-button-primary"
        >
          Choose this representative
        </button>
      </div>
    </div>
  );
};

export default searchRepresentativeResult;
