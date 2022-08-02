import React from 'react';
import PropTypes from 'prop-types';

export const PrimaryHealthCoverage = ({ pageTitle }) => (
  <>{pageTitle && <h3 className="vads-u-font-size--h4">{pageTitle}</h3>}</>
);

PrimaryHealthCoverage.propTypes = {
  pageTitle: PropTypes.string,
};
