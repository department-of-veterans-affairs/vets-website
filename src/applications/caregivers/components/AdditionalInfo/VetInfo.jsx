import React from 'react';
import PropTypes from 'prop-types';

export const VetInfo = ({ pageTitle, showPageIntro }) => (
  <>
    {pageTitle && <h3 className="vads-u-font-size--h4">{pageTitle}</h3>}

    {showPageIntro && (
      <p className="vads-u-margin-top--2">
        Please complete all the following information.
      </p>
    )}
  </>
);

VetInfo.propTypes = {
  pageTitle: PropTypes.string,
  showPageIntro: PropTypes.bool,
};

VetInfo.defaultProps = {
  showPageIntro: false,
};
