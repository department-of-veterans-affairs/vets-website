import React from 'react';
import { CHAPTER_TYPE } from '../../config/enums';

/**
 * Formats the card description based on the chapter type.
 *
 * The va-card component doesnt support styling the description so
 * made our own method so that we could format it to look better.
 *
 * @param {item} object - The form data for a given chapter.
 * @param {type} integer - The chapter that we are formatting (uses CHAPTER_TYPE)
 * @returns {object} - A jsx object that is displayed in the card description
 *
 * @example
 * getCardDescription(item, CHAPTER_TYPE.CHARACTER)
 */
export const getCardDescription = (item, type) => {
  // If 'item' does NOT exist (is falsy), return null immediately.
  if (!item) {
    return null;
  }

  if (type === CHAPTER_TYPE.CHARACTER) {
    return (
      <>
        <p>
          <b>Phone Number:</b> {item?.phone}
        </p>
        <p>
          <b>Email:</b> {item?.email}
        </p>
        <p>
          <b>Relationship:</b> {item?.relationship}
        </p>
      </>
    );
  }

  return 'test';
};
