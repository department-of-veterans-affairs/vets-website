import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';

const PageLink = ({ linkText, relativeURL, URL }) => {
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
      className="vads-c-action-link--green vads-u-margin-top--5"
      href={URL}
      onClick={handleClick}
    >
      {linkText}
    </a>
  );
};

PageLink.propTypes = {
  URL: PropTypes.string,
  linkText: PropTypes.string,
  relativeURL: PropTypes.string,
};
export default PageLink;
