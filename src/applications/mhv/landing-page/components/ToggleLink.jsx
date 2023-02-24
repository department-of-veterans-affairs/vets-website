import React from 'react';
import PropTypes from 'prop-types';

const ToggleLink = ({ link }) => {
  const { text } = link;
  // TODO: Incorporate logic for feature toggle check
  const href = link.href ? link.href : link.oldHref;
  return (
    <a className="mhv-c-navlink" href={href}>
      {text}
      <i aria-hidden="true" />
    </a>
  );
};

ToggleLink.propTypes = {
  link: PropTypes.shape({
    text: PropTypes.string,
    href: PropTypes.string,
    oldHref: PropTypes.string,
    toggle: PropTypes.string,
  }),
};

export default ToggleLink;
