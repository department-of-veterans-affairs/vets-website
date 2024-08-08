const hasOwn = (object, prop) =>
  Object.prototype.hasOwnProperty.call(object, prop);

export const toggleLink = (link, featureToggles = {}) => {
  const {
    oldText,
    text: newText,
    oldHref,
    href: newHref,
    toggle,
    ariaLabel,
  } = link;
  const showNewLink =
    (!!toggle && (hasOwn(featureToggles, toggle) && featureToggles[toggle])) ||
    (!oldText && !oldHref);
  const href = showNewLink ? newHref : oldHref;
  const text = showNewLink ? newText : oldText;
  return { href, text, key: toggle, ariaLabel };
};

const resolveLinks = (links, featureToggles) =>
  links.map(l => toggleLink(l, featureToggles)).filter(l => !!l.href);

export default resolveLinks;
