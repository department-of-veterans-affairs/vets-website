import React from 'react';
import PropTypes from 'prop-types';

import linkIcon from 'site/assets/img/icons/SVG/link.svg';

function NewTabAnchor({ href, anchorText }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-describedby="new-tab-msg-1"
    >
      {anchorText}
      <img
        src={linkIcon}
        className="vaos__external-link"
        alt="Link"
        aria-hidden="true"
      />
    </a>
  );
}

NewTabAnchor.propTypes = {
  href: PropTypes.string,
  anchorText: PropTypes.string,
};

export default NewTabAnchor;
