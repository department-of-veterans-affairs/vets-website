import React from 'react';

const RatedDisabilitiesHeader = props => {
  return (
    <div>
      <h1>{props.headline}</h1>
      <p className="vads-u-font-size--lg vads-u-font-family--serif">
        {props.content}
      </p>
    </div>
  );
};

export default RatedDisabilitiesHeader;
