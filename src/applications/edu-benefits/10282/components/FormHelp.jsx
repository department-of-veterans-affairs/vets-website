import React from 'react';
import PropTypes from 'prop-types';

const FormHelp = ({ tag }) => {
  const DynamicTag = tag;
  return (
    <DynamicTag>
      <div slot="content">
        <p className="vads-u-margin-top--1">
          For help filling out this form, email{' '}
          <a
            href="mailto:vettecpartner@va.gov"
            target="_blank"
            rel="noreferrer"
          >
            vettecpartner@va.gov.
          </a>
        </p>
      </div>
    </DynamicTag>
  );
};

FormHelp.propTypes = {
  tag: PropTypes.symbol,
};

export default FormHelp;
