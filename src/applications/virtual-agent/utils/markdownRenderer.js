import MarkdownIt from 'markdown-it';
import markdownitLinkAttributes from 'markdown-it-link-attributes';

const markdownRenderer = MarkdownIt({
  html: true,
  linkify: true,
}).use(markdownitLinkAttributes, {
  attrs: {
    target: '_blank',
    rel: 'noopener',
  },
});

export default markdownRenderer;
