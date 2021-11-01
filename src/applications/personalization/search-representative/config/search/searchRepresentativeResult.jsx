import React from 'react';

const searchRepresentativeResult = props => {
  const customStyle = {
    maxWidth: 180,
  };
  const linkStyles = {
    borderRadius: 0,
    textDecoration: 'underline',
  };
  return (
    <div className="vads-u-margin-bottom--1p5 vads-u-background-color--gray-lighter vads-u-padding--1p5">
      <p className="vads-u-font-size--h3 vads-u-font-family--serif vads-u-font-weight--bold">
        {props.option.name}
      </p>
      <p className="vads-u-font-weight--bold">{props.option.type}</p>
      <p>{props.option.address}</p>
      <p>{props.option.city}</p>
      <p>{props.option.phone}</p>
      <div style={customStyle}>
        <button
          style={linkStyles}
          onClick={() => props.handleClick(props.option.name)}
          className="vads-u-background-color--gray-lighter vads-u-color--link-default vads-u-font-weight--normal vads-u-padding--0"
        >
          Choose this representative
        </button>
      </div>
    </div>
  );
};

export default searchRepresentativeResult;
