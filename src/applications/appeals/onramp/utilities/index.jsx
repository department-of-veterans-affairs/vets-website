import React from 'react';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';

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

/**
 * When page first loads, scroll to the top and focus on the h1
 * We have two different types of question setups, so the header must be targeted accordingly
 * 1. Plain header: no descriptionText (refer to question-data-map). Plain <h1>
 * 2. Shadow header: descriptionText present. <h1> ends up in the shadow DOM of the va-radio
 */
export const pageSetup = () => {
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  const plainHeader = document?.querySelector('h1');
  const radio = document?.getElementById('onramp-radio');

  focusElement('h1');

  if (!plainHeader) {
    focusElement('h1', {}, radio);
  }
};
