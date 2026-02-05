import PropTypes from 'prop-types';

/**
 * Shared PropTypes definitions for TrackedItemContent components
 * Provides type validation for structured JSON content from the API
 */

/**
 * Inline content shape - represents text or inline formatting elements
 * Can be a string, an inline element object, or an array of either
 */
const inlineContentShape = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.shape({
    type: PropTypes.oneOf(['bold', 'italic', 'link', 'telephone', 'lineBreak'])
      .isRequired,
    // Nested content for bold/italic
    content: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    // Link-specific properties
    text: PropTypes.string,
    href: PropTypes.string,
    style: PropTypes.oneOf(['active', 'default', 'external']),
    testId: PropTypes.string,
    // Telephone-specific properties
    contact: PropTypes.string,
    tty: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  }),
  PropTypes.arrayOf(PropTypes.any), // Arrays handled recursively by renderer
]);

/**
 * Block-level content shape - represents paragraphs, lists, line breaks
 */
export const BlockPropType = PropTypes.shape({
  type: PropTypes.oneOf(['paragraph', 'list', 'lineBreak']).isRequired,
  // Paragraph content
  content: inlineContentShape,
  // List-specific properties
  style: PropTypes.oneOf(['bullet', 'numbered']),
  items: PropTypes.arrayOf(inlineContentShape),
});

/**
 * Top-level content structure - array of blocks
 */
export const ContentPropType = PropTypes.arrayOf(BlockPropType);

/**
 * InlineRenderer content prop type
 * More permissive to allow recursive rendering
 */
export const InlineContentPropType = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.arrayOf(PropTypes.any), // Allows recursive arrays
  PropTypes.shape({
    type: PropTypes.oneOf(['bold', 'italic', 'link', 'telephone', 'lineBreak'])
      .isRequired,
    content: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    text: PropTypes.string,
    href: PropTypes.string,
    style: PropTypes.oneOf(['active', 'default', 'external']),
    testId: PropTypes.string,
    contact: PropTypes.string,
    tty: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  }),
]);
