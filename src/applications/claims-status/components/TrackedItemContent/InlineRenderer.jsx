import React from 'react';
import PropTypes from 'prop-types';
import {
  VaLink,
  VaTelephone,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

/**
 * Renders inline content elements (bold, italic, links, telephone, line breaks)
 * Handles nested content and mixed arrays of strings and inline elements
 */
export const InlineRenderer = ({ content }) => {
  // Handle string content
  if (typeof content === 'string') {
    return content;
  }

  // Handle array of mixed content
  if (Array.isArray(content)) {
    return (
      <>
        {content.map((item, idx) => (
          <InlineRenderer key={idx} content={item} />
        ))}
      </>
    );
  }

  // Handle object-based inline elements
  if (typeof content === 'object' && content !== null) {
    switch (content.type) {
      case 'bold':
        return (
          <strong>
            <InlineRenderer content={content.content} />
          </strong>
        );
      case 'italic':
        return (
          <em>
            <InlineRenderer content={content.content} />
          </em>
        );
      case 'link':
        return (
          <VaLink
            active={content.style === 'active'}
            text={content.text}
            href={content.href}
            data-testid={content.testId}
          />
        );
      case 'telephone':
        return <VaTelephone contact={content.contact} tty={content.tty} />;
      case 'lineBreak':
        return <br />;
      default:
        return null;
    }
  }

  return null;
};

InlineRenderer.propTypes = {
  content: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array,
    PropTypes.shape({
      type: PropTypes.string.isRequired,
      content: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.array,
        PropTypes.object,
      ]),
      text: PropTypes.string,
      href: PropTypes.string,
      style: PropTypes.string,
      testId: PropTypes.string,
      contact: PropTypes.string,
      tty: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    }),
  ]).isRequired,
};
