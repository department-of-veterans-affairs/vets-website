import React from 'react';

export const printErrorMessage = message =>
  // eslint-disable-next-line no-console
  console.error(message);

/**
 * Used for summary screens
 * Takes a list of 0 or more items and returns the proper markup
 *
 * @param {*} items List of 0 or more items to render
 * @param {*} useSentenceFormat Flag indicating whether to include ', and'
 * after each list item except the last one
 * @param {*} paragraphClass Optional param for class name(s) for the single item
 * @param {*} listItemClasses Optional param for class name(s) for each list item
 */
export const renderSingleOrList = (
  items,
  useSentenceFormat,
  paragraphClass = null,
  listItemClasses = null,
  testId = null,
) => {
  if (!items?.length) return null;

  if (items.length === 1) {
    return (
      <p className={paragraphClass || null} data-testid={`${testId}-0`}>
        {items[0]}
        {useSentenceFormat && '.'}
      </p>
    );
  }

  return (
    <ul>
      {items.map((item, index) => (
        <li
          className={listItemClasses}
          data-testid={`${testId}-${index}`}
          key={index}
        >
          {item}
          {useSentenceFormat && index <= items.length - 2 ? (
            <>
              , <strong>and</strong>
            </>
          ) : null}
        </li>
      ))}
    </ul>
  );
};
