import React from 'react';

const searchRepresentativeResult = props => {
  const customStyle = {
    maxWidth: 180,
  };
  return (
    <div className="vads-u-margin-bottom--1p5 vads-u-background-color--gray-lightest vads-u-padding--4">
      <p className="vads-u-margin-top--0 vads-u-font-size--h3 vads-u-font-family--serif vads-u-font-weight--bold">
        {props.option.name}
      </p>
      <p className="vads-u-font-weight--bold">{props.option.type}</p>
      <p>{props.option.address}</p>
      <p>{props.option.city}</p>
      <p className="vads-u-margin-bottom--4">{props.option.phone}</p>
      <div style={customStyle}>
        <button
          onClick={() =>
            props.handleClick(
              props.option.name,
              props.option.address,
              props.option.city,
              props.option.phone,
              props.option.type,
            )
          }
          className="va-button-link"
        >
          Select this representative
        </button>
      </div>
    </div>
  );
};

export default searchRepresentativeResult;
