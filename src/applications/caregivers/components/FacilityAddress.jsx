import PropTypes from 'prop-types';
import React from 'react';

const FacilityAddress = ({ facility }) => {
  if (!facility) return null;

  const { name, address: { physical } = {} } = facility;

  const addressText = [
    physical?.address1,
    physical?.address2,
    physical?.address3,
  ]
    .filter(Boolean)
    .map((line, index, src) => (
      <React.Fragment key={line}>
        {line}
        {index < src.length - 1 && <br role="presentation" />}
      </React.Fragment>
    ));

  return (
    <p className="va-address-block">
      {name && (
        <>
          <strong className="vads-u-font-size--h4 vads-u-margin-top--0">
            {name}
          </strong>
          <br role="presentation" />
        </>
      )}
      {addressText}
    </p>
  );
};

FacilityAddress.propTypes = {
  facility: PropTypes.object,
};

export default React.memo(FacilityAddress);
