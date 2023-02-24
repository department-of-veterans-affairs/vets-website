import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

const hasOwn = (object, prop) =>
  Object.prototype.hasOwnProperty.call(object, prop);

const ToggleLink = ({ link }) => {
  const { featureToggles } = useSelector(state => state);
  const { text, oldHref, href: newHref, toggle } = link;
  let href = newHref || oldHref;
  // If the link's toggle matches a feature toggle
  // check if the toggle is on. If so, show new href. Otherwise show old href
  if (hasOwn(featureToggles, toggle)) {
    const showNewHref = featureToggles[toggle] === true;
    href = showNewHref ? link.href : link.oldHref;
  }
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
