import MarkdownIt from 'markdown-it';
import markdownitLinkAttributes from 'markdown-it-link-attributes';
import recordEvent from '@department-of-veterans-affairs/platform-monitoring/record-event';
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

function recordChatbotLinkClicks(origin) {
  if (origin.id && origin.id === 'chatbotLink') {
    recordEvent({
      event: 'chatbot-resource-link-click',
      link: origin.href,
      linkText: origin.text,
      time: new Date(),
    });
  }
}

function recordChatbotButtonClicks(origin) {
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

export function recordChatbotEvents(e) {
  const { target } = e;

  const closestLink = target.closest('a');
  const closestSpan = target.closest('span');
  const closestButton = target.closest('button');

  if (closestLink) {
    recordChatbotLinkClicks(closestLink);
  } else if (closestSpan || closestButton) {
    recordChatbotButtonClicks(closestSpan ?? closestButton);
  }
}

document.addEventListener('click', recordChatbotEvents);

export function getRenderToken(tokens, idx, options, env, self) {
  return self.renderToken(tokens, idx, options);
}

// Remember old renderer, if overridden, or proxy to default renderer
export function getDefaultRenderer(renderer) {
  return renderer.renderer.rules.link_open || getRenderToken;
}

export const defaultRender = getDefaultRenderer(markdownRenderer);

const linkOpen = 'link_open';
markdownRenderer.renderer.rules[linkOpen] = (
  tokens,
  idx,
  options,
  env,
  self,
) => {
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
