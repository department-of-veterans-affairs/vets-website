import React from 'react';
import PropTypes from 'prop-types';

export const ConfirmationTitle = ({ pageTitle }) => (
  <div className="print-only">
    <img
      src="https://www.va.gov/img/design/logo/logo-black-and-white.png"
      alt="VA logo"
      width="300"
    />
    <h2 className="vads-u-margin-top--0">{pageTitle}</h2>
  </div>
);

ConfirmationTitle.propTypes = {
  pageTitle: PropTypes.string,
};
