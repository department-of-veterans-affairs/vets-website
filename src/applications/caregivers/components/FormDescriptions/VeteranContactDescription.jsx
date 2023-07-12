import React from 'react';
import PropTypes from 'prop-types';

const VeteranContactDescription = ({ pageTitle, showPageIntro }) => (
  <>
    {pageTitle && <h3 className="vads-u-font-size--h4">{pageTitle}</h3>}

    {showPageIntro && (
      <p className="vads-u-margin-top--2" data-testid="cg-page-intro">
        Please complete all the following information.
      </p>
    )}
  </>
);

VeteranContactDescription.propTypes = {
  pageTitle: PropTypes.string,
  showPageIntro: PropTypes.bool,
};

VeteranContactDescription.defaultProps = {
  showPageIntro: false,
};

export default VeteranContactDescription;
