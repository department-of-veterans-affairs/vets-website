import React from 'react';
import PropTypes from 'prop-types';

const LiSpanAndVaLink = ({ href, hrefText, testId }) => (
  <li data-testid={testId || null}>
    <va-link href={href} text={hrefText} />
  </li>
);

LiSpanAndVaLink.propTypes = {
  href: PropTypes.string.isRequired,
  hrefText: PropTypes.string.isRequired,
  testId: PropTypes.string,
};

export default LiSpanAndVaLink;
