import React from 'react';
import { BlockRenderer } from './BlockRenderer';
import { ContentPropType } from './contentPropTypes';

/**
 * Main component that renders structured content blocks from the API
 * Converts structured JSON content into proper React JSX with VA Design System components
 */
export const TrackedItemContent = ({ content }) => {
  if (!content?.blocks || !Array.isArray(content.blocks)) {
    return null;
  }

  return (
    <>
      {content.blocks.map((block, idx) => (
        <BlockRenderer key={idx} block={block} />
      ))}
    </>
  );
};

TrackedItemContent.propTypes = {
  content: ContentPropType,
};
