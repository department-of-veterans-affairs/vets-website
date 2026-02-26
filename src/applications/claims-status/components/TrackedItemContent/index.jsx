import React from 'react';
import { BlockRenderer } from './BlockRenderer';
import { ContentPropType } from './contentPropTypes';

/**
 * Main component that renders structured content blocks from the API
 * Converts structured JSON content into proper React JSX with VA Design System components
 * @param {Array} content - Array of content blocks to render
 */
export const TrackedItemContent = ({ content }) => {
  if (!content || !Array.isArray(content)) {
    return null;
  }

  return (
    <>
      {content.map((block, idx) => (
        <BlockRenderer key={idx} block={block} />
      ))}
    </>
  );
};

TrackedItemContent.propTypes = {
  content: ContentPropType,
};
