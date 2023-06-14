import MarkdownIt from 'markdown-it';
import markdownitLinkAttributes from 'markdown-it-link-attributes';
import recordEvent from 'platform/monitoring/record-event';
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

document.addEventListener('click', e => {
  const { target } = e;

  if (target.closest('a')) {
    const origin = target.closest('a');
    if (origin.id && origin.id === 'chatbotLink') {
      recordEvent({
        event: 'chatbot-resource-link-click',
        link: origin.href,
        linkText: origin.text,
        time: new Date(),
      });
    }
  } else if (target.closest('span')) {
    const origin = target.closest('span');
    if (origin.innerText === 'Speak with an agent') {
      recordEvent({
        event: 'cta-button-click',
        'button-type': 'default',
        'button-click-label': origin.innerText,
        'button-background-color': 'blue',
        time: new Date(),
      });
    }
  } else if (target.closest('button')) {
    const origin = target.closest('button');
    if (origin.innerText === 'Speak with an agent') {
      recordEvent({
        event: 'cta-button-click',
        'button-type': 'default',
        'button-click-label': origin.innerText,
        'button-background-color': 'blue',
        time: new Date(),
      });
    }
  }
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

  tokens[idx].attrPush(['id', 'chatbotLink']);

  // pass token to default renderer.
  return defaultRender(tokens, idx, options, env, self);
};

export default markdownRenderer;
