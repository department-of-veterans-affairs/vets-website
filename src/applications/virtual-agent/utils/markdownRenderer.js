import MarkdownIt from 'markdown-it';
import markdownitLinkAttributes from 'markdown-it-link-attributes';
import recordEvent from '@department-of-veterans-affairs/platform-monitoring/record-event';
import makePhoneNumberAriaLabel from './makePhoneNumberAriaLabel';
import { getEventSkillValue } from './sessionStorage';

const markdownRenderer = MarkdownIt({
  html: true,
  linkify: false,
}).use(markdownitLinkAttributes, {
  attrs: {
    target: '_blank',
    rel: 'noopener',
  },
});

function recordChatbotLinkClicks(origin) {
  if (origin.id && origin.id === 'chatbotLink') {
    const topic = getEventSkillValue();
    recordEvent({
      event: 'chatbot-resource-link-click',
      link: origin.href,
      linkText: origin.text,
      topic,
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

/**
 * Strips markdown formatting from text, converting it to plain text suitable for screen readers.
 * Uses markdown-it to parse and extract text content from tokens.
 * @param {string} markdown - The markdown text to convert
 * @returns {string} Plain text with markdown removed
 */
export function stripMarkdown(markdown) {
  if (!markdown || typeof markdown !== 'string') {
    return markdown || '';
  }

  // Parse markdown into tokens
  const tokens = markdownRenderer.parse(markdown, {});

  // Extract text content from tokens recursively
  const extractText = token => {
    // Extract text from text tokens and inline code
    if (token.type === 'text' || token.type === 'code_inline') {
      return token.content || '';
    }

    // For links, extract the link text (children contain the text)
    if (token.type === 'link_open' || token.type === 'link_close') {
      return '';
    }

    // Recursively extract text from children
    if (token.children && Array.isArray(token.children)) {
      return token.children.map(extractText).join('');
    }

    return '';
  };

  const plainText = tokens.map(extractText).join(' ');

  // Clean up extra whitespace and normalize line breaks
  return plainText
    .replace(/\s+/g, ' ')
    .replace(/\n\s*\n/g, '\n')
    .trim();
}

export default markdownRenderer;
