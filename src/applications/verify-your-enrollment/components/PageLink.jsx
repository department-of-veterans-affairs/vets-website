import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';

const PageLink = ({ linkText, relativeURL, URL, color, margin }) => {
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
      className={`vads-c-action-link--${color} vads-u-margin-top--${margin}`}
      href={URL}
      onClick={handleClick}
    >
      {linkText}
    </a>
  );
};

PageLink.propTypes = {
  URL: PropTypes.string,
  color: PropTypes.string,
  linkText: PropTypes.string,
  margin: PropTypes.string,
  relativeURL: PropTypes.string,
};
export default PageLink;
