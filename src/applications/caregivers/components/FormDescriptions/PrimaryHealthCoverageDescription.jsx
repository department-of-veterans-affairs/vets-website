import React from 'react';
import PropTypes from 'prop-types';

const PrimaryHealthCoverageDescription = ({ pageTitle }) => (
  <>{!!pageTitle && <h3 className="vads-u-font-size--h4">{pageTitle}</h3>}</>
);

PrimaryHealthCoverageDescription.propTypes = {
  pageTitle: PropTypes.string,
};

export default PrimaryHealthCoverageDescription;
