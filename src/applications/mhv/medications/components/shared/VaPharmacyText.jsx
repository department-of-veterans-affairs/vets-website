import React from 'react';
import PropTypes from 'prop-types';

const VAPharmacyText = ({ phone = '' }) => {
  let dialFragment = '';
  if (phone) {
    dialFragment = (
      <>
        {' '}
        at <va-telephone contact={phone} />
      </>
    );
  }
  return (
    <>
      your VA pharmacy
      {dialFragment}
    </>
  );
};

VAPharmacyText.propTypes = {
  phone: PropTypes.string,
};

export default VAPharmacyText;
