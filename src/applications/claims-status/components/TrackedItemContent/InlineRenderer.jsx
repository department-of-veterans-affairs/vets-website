import React from 'react';
import {
  VaLink,
  VaTelephone,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { InlineContentPropType } from './contentPropTypes';

/**
 * Renders inline content elements (bold, italic, links, telephone, line breaks)
 * Handles nested content and mixed arrays of strings and inline elements
 */
export const InlineRenderer = ({ content }) => {
  // Early return for null or undefined
  if (content == null) return null; // Catches null and undefined

  // Early return for invalid types (not string or object)
  if (typeof content !== 'string' && typeof content !== 'object') {
    return null;
  }

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
            text={content.text}
            href={content.href}
            data-testid={content.testId}
            {...(content.style === 'active' && { active: true })}
            {...(content.style === 'external' && { external: true })}
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
  content: InlineContentPropType.isRequired,
};
