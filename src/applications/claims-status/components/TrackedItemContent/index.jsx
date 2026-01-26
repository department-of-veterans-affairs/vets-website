import React from 'react';
import PropTypes from 'prop-types';
import { BlockRenderer } from './BlockRenderer';

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
  content: PropTypes.shape({
    blocks: PropTypes.arrayOf(
      PropTypes.shape({
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
      }),
    ),
  }),
};
