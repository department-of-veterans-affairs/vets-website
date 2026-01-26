import React from 'react';
import PropTypes from 'prop-types';
import { InlineRenderer } from './InlineRenderer';

/**
 * Renders block-level elements (paragraphs, lists, line breaks)
 */
export const BlockRenderer = ({ block }) => {
  if (!block || typeof block !== 'object') {
    return null;
  }

  switch (block.type) {
    case 'paragraph':
      return (
        <p>
          <InlineRenderer content={block.content} />
        </p>
      );
    case 'list': {
      const ListTag = block.style === 'numbered' ? 'ol' : 'ul';
      const className = block.style === 'bullet' ? 'bullet-disc' : undefined;
      return (
        <ListTag {...(className ? { className } : {})}>
          {block.items?.map((item, idx) => (
            <li key={idx}>
              <InlineRenderer content={item} />
            </li>
          ))}
        </ListTag>
      );
    }
    case 'lineBreak':
      return <br />;
    default:
      return null;
  }
};

BlockRenderer.propTypes = {
  block: PropTypes.shape({
    type: PropTypes.oneOf(['paragraph', 'list', 'lineBreak']).isRequired,
    content: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.array,
      PropTypes.object,
    ]),
    style: PropTypes.oneOf(['bullet', 'numbered']),
    items: PropTypes.arrayOf(
      PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.array,
        PropTypes.object,
      ]),
    ),
  }).isRequired,
};
