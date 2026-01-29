import React from 'react';
import PropTypes from 'prop-types';

const VAPharmacyText = ({ phone = '', isNotClickable = false }) => {
  let dialFragment = '';
  if (phone) {
    dialFragment = (
      <>
        {' '}
        at <va-telephone contact={phone} not-clickable={isNotClickable} />
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
  isNotClickable: PropTypes.bool,
  phone: PropTypes.string,
};

export default VAPharmacyText;
