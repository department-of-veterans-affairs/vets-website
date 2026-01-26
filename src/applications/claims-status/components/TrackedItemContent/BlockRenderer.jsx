import React from 'react';
import { InlineRenderer } from './InlineRenderer';
import { BlockPropType } from './contentPropTypes';

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

      // Filter out null, undefined, empty strings, and empty arrays for accessibility
      const validItems = (block.items || []).filter(item => {
        if (item == null) return false; // Filters null and undefined
        if (typeof item === 'string') return item.trim().length > 0;
        if (Array.isArray(item)) return item.length > 0;
        return true; // Keep objects (schema guarantees they have required properties)
      });

      // Don't render empty lists
      if (validItems.length === 0) {
        return null;
      }

      return (
        <ListTag className={className}>
          {validItems.map((item, idx) => (
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
  block: BlockPropType.isRequired,
};
