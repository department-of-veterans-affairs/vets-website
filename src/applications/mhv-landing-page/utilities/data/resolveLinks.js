const hasOwn = (object, prop) =>
  Object.prototype.hasOwnProperty.call(object, prop);

const isToggled = (toggle, featureToggles) =>
  !!toggle && (hasOwn(featureToggles, toggle) && featureToggles[toggle]);

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
    isToggled(toggle, featureToggles) || (!oldText && !oldHref);

  const href = showNewLink ? newHref : oldHref;
  const text = showNewLink ? newText : oldText;
  const isExternal = !!link.isExternal;
  return { href, text, key: toggle, ariaLabel, isExternal };
};

// Removes links that (all must be true):
// 1. Are not toggled (feature flag disabled)
// 2. Have no `oldText` or `oldHref`
// 3. Should be "hard toggled" (completely disabled)
//     e.g. in the case of a brand-new link with no `oldText`
//     or in the event the link should be removed quickly and completely
const filterOutHideableLinks = (links, featureToggles) => {
  return links.filter(
    ({ toggle, hardToggle }) =>
      !(!isToggled(toggle, featureToggles) && hardToggle),
  );
};

const resolveLinks = (links, featureToggles) => {
  const visibleLinks = filterOutHideableLinks(links, featureToggles);
  return visibleLinks
    .map(l => toggleLink(l, featureToggles))
    .filter(l => !!l.href);
};

export default resolveLinks;
