import MarkdownIt from 'markdown-it';
import markdownitLinkAttributes from 'markdown-it-link-attributes';
import makePhoneNumberAriaLabel from './makePhoneNumberAriaLabel';

const markdownRenderer = MarkdownIt({
  html: true,
  linkify: true,
}).use(markdownitLinkAttributes, {
  attrs: {
    target: '_blank',
    rel: 'noopener',
  },
});

// Remember old renderer, if overridden, or proxy to default renderer
const defaultRender =
  markdownRenderer.renderer.rules.link_open ||
  function(tokens, idx, options, env, self) {
    return self.renderToken(tokens, idx, options);
  };

const linkOpen = 'link_open';
markdownRenderer.renderer.rules[linkOpen] = function(
  tokens,
  idx,
  options,
  env,
  self,
) {
  const [, href] = tokens[idx].attrs.find(([key]) => key === 'href');
  const [scheme, phoneNumber] = href.split(':');

  if (scheme === 'tel') {
    const ariaLabel = makePhoneNumberAriaLabel(phoneNumber);

    tokens[idx].attrPush(['aria-label', ariaLabel]); // add new attribute
  }

  tokens[idx].attrPush([
    'onclick',
    "window.dataLayer && window.dataLayer.push({event: 'chatbot-resource-link-click'});",
  ]);

  // pass token to default renderer.
  return defaultRender(tokens, idx, options, env, self);
};

export default markdownRenderer;
