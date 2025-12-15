import React from 'react';
import OutsideDROption from '../components/dr-results-screens/OutsideDROption';
import * as c from '../constants/results-content/dr-screens/card-content';
import { DISPLAY_CONDITIONS } from '../constants/display-conditions';
import { displayConditionsMet } from './display-conditions';
import { HORIZ_RULE } from '../constants/results-content/common';
import { renderSingleOrList } from '.';

/**
 * Content is defined with SNAKE_CASE prefixes by type, e.g.:
 * TITLE_SC = The title for the SC card
 * CARD_CONTENT_GF_SC = An array of possible content items for the SC card
 * CARD_GF_REVIEW_SC = A bulleted item for the SC card
 *
 * Once it is determined that a card should be displayed (ex. CARD_SC),
 * we can swap the prefix to get the matching content to evaluate for display.
 * @param {String} string - The string to swap prefixes with (e.g. CARD_SC)
 * @param {String} from - The prefix to swap from (e.g. CARD)
 * @param {String} to - The Prefix to swap to (e.g. TITLE)
 * @returns {String}
 */
export const swapPrefix = (string, from, to, keepUnderscore = true) => {
  if (!string.includes(from)) return '';

  if (!keepUnderscore) {
    return string.replace(`${from}_`, to);
  }

  return string.replace(from, to);
};

/**
 * Gets the title for a "Good Fit" or "Not Good Fit" card
 * by taking the given card type (e.g. CARD_SC) and swapping
 * its prefix with the matching title prefix to get the constant (e.g. TITLE_SC)
 * @param {String} card - The card type (e.g. CARD_SC)
 * @returns {String} - The matching title (e.g. Supplemental Claims)
 */
export const getCardTitle = card => {
  const title = swapPrefix(card, 'CARD', 'TITLE');

  if (!title) return null;

  return c?.[title];
};

/**
 * Gets the content for either a "Good Fit" or "Not Good Fit" card
 * by evaluating each piece of content in the batch (e.g. CARD_CONTENT_NGF_SC)
 * against its display conditions
 * @param {String} card - The card type (e.g. CARD_SC)
 * @param {Object} formResponses - All the form answers in the Redux store
 * @param {Boolean} goodFit - A flag to indicate whether we are in the "Good Fit"
 * or "Not Good Fit" card section
 * @returns {JSX} - A list or single paragraph of content
 */
export const getCardContent = (card, formResponses, goodFit) => {
  const newPrefix = goodFit ? 'CARD_CONTENT_GF' : 'CARD_CONTENT_NGF';
  const contentType = swapPrefix(card, 'CARD', newPrefix);

  if (!contentType) return null;

  const content = c?.[contentType] || [];

  const toDisplay = content?.filter(contentItem => {
    const itemDCs = DISPLAY_CONDITIONS?.[contentItem] || {};

    if (displayConditionsMet(formResponses, itemDCs)) {
      return contentItem;
    }

    return null;
  });

  if (!toDisplay.length) return null;

  const testId = goodFit ? 'gf' : 'ngf';

  return renderSingleOrList(toDisplay, true, null, null, `${testId}-content`);
};

/**
 * Returns the "Learn more about" link for DR flows for "Good Fit" cards
 * @param {String} card - The card type (e.g. CARD_HLR)
 * @returns {JSX} - The appropriate learn more link for the flow
 */
export const getLearnMoreLink = card => {
  let cardName = card;

  if (card.includes('BOARD')) {
    cardName = 'CARD_BOARD';
  }

  const linkInfoTitle = swapPrefix(cardName, 'CARD', 'LEARN_MORE');
  const linkInfo = c?.[linkInfoTitle];

  if (!linkInfo) return null;

  return <va-link external href={linkInfo.url} text={linkInfo.text} />;
};

/**
 * Returns the "Start" link for DR flows for "Good Fit" cards
 * @param {String} card - The card type (e.g. CARD_HLR)
 * @returns {JSX} - The appropriate start link for the flow
 */
export const getStartLink = card => {
  let cardName = card;

  if (card.includes('BOARD')) {
    cardName = 'CARD_BOARD';
  }

  const startLinkTitle = swapPrefix(cardName, 'CARD', 'START');
  const startLink = c?.[startLinkTitle];

  if (!startLink) return null;

  return (
    <va-link-action
      class="vads-u-display--block vads-u-margin-top--1"
      href={startLink.url}
      text={startLink.text}
    />
  );
};

/**
 * Used for determining whether the Court of Appeals card should show
 * @param {Object} formResponses - All the form answers in the Redux store
 * @returns {JSX|null}
 */
export const showOutsideDROption = formResponses => {
  const displayConditions = DISPLAY_CONDITIONS?.[c.CARD_COURT_OF_APPEALS] || {};

  if (displayConditionsMet(formResponses, displayConditions)) {
    return (
      <>
        {HORIZ_RULE}
        <OutsideDROption />
      </>
    );
  }

  return null;
};

/**
 * TODO - for now this is hard-coded but eventually we will have this
 * integrated with an API to pull data from the static pages on VA.gov
 * @param {} card - String representing the card type, e.g. CARD_SC
 */
export const getDecisionTimeline = card => {
  const type = swapPrefix(card, 'CARD', '', false);
  if (!type) return null;

  return c.DECISION_TIMELINES?.[type] || '';
};
