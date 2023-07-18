import React from 'react';
import PropTypes from 'prop-types';

const Error = ({ content, headline }) => (
  <va-alert close-btn-aria-label="Close notification" status="error" visible>
    <h2 slot="headline">{headline}</h2>
    <div className="vads-u-margin-y--0">
      <p className="vads-u-margin-bottom--0">{content}</p>
    </div>
  </va-alert>
);

Error.propTypes = {
  content: PropTypes.string,
  headline: PropTypes.string,
};

Error.defaultProps = {
  content: 'Try again, later.',
  headline: "Sorry, we couldn't find that",
};

export default Error;
