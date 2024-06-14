import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';

const PageLink = ({ linkText, relativeURL, URL, className, margin }) => {
  const history = useHistory();

  const handleClick = useCallback(
    event => {
      if (history) {
        event.preventDefault();
        history.push(relativeURL);
      }
    },
    [history],
  );

  return (
    <a
      className={`${className} vads-u-margin-top--${margin}`}
      href={URL}
      onClick={relativeURL && handleClick}
    >
      {linkText}
    </a>
  );
};

PageLink.propTypes = {
  URL: PropTypes.string,
  className: PropTypes.string,
  linkText: PropTypes.string,
  margin: PropTypes.string,
  relativeURL: PropTypes.string,
};
export default PageLink;
