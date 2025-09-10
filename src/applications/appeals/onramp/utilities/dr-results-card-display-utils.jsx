import React from 'react';
import GoodFitCard from '../components/dr-results-screens/GoodFitCard';
import NotGoodFitCard from '../components/dr-results-screens/NotGoodFitCard';
import OverviewPanel from '../components/dr-results-screens/OverviewPanel';
import * as c from '../constants/results-content/dr-screens/card-content';
import { DISPLAY_CONDITIONS } from '../constants/display-conditions';
import { displayConditionsMet, isCFIVariant } from './display-conditions';
import {
  CLAIM_FOR_INCREASE_CARD,
  CONDITION_HAS_WORSENED_INFO,
  DR_HEADING,
  HORIZ_RULE,
  PRINT_RESULTS,
  RESTART_GUIDE,
} from '../constants/results-content/common';
import { showOutsideDROption } from './dr-results-content-utils';

/**
 * Used for both "Good Fit" (white) and "Not Good Fit" (gray) cards
 * Dynamically determines the card content and evaluates what should
 * show on the card based on display conditions
 * @param {Object} formResponses - All the form answers in the Redux store
 * @param {Boolean} goodFit - A flag to indicate whether we are in the "Good Fit"
 * card section or the "Not Good Fit" card section
 * @returns
 */
export const displayCards = (formResponses, goodFit) => {
  const cardsToDisplay = [];
  const path = goodFit ? 'GOOD_FIT' : 'NOT_GOOD_FIT';

  c.CARDS.forEach(card => {
    const displayConditionsForCard = DISPLAY_CONDITIONS?.[card]?.[path] || {};

    if (displayConditionsMet(formResponses, displayConditionsForCard)) {
      if (goodFit) {
        cardsToDisplay.push(
          <li key={card}>
            <GoodFitCard card={card} formResponses={formResponses} />
          </li>,
        );
      } else {
        cardsToDisplay.push(
          <li key={card}>
            <NotGoodFitCard card={card} formResponses={formResponses} />
          </li>,
        );
      }
    }

    return null;
  });

  return cardsToDisplay;
};

export const displayNotGoodFitCards = formResponses => {
  const cardsToDisplay = displayCards(formResponses, false);

  if (cardsToDisplay.length) {
    return (
      <>
        {HORIZ_RULE}
        <h3>All other decision review options</h3>
        <p>
          Based on your answers, these choices may not fit your situation. You
          are always free to submit any claim you choose.
        </p>
        {/* Adding a `role="list"` to `ul` with `list-style: none` to work around
          a problem with Safari not treating the `ul` as a list. */}
        {/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
        <ul className="onramp-list-none" role="list">
          {cardsToDisplay}
        </ul>
      </>
    );
  }

  return null;
};

const INTRO = (
  <p>
    Based on your answers, here’s information about the options available to
    you.
  </p>
);

export const getCardProps = formResponses => {
  const gfCards = displayCards(formResponses, true);
  const isCFI = isCFIVariant(formResponses);

  return {
    h1: DR_HEADING,
    bodyContent: (
      <>
        {INTRO}
        <OverviewPanel formResponses={formResponses} />
        {PRINT_RESULTS}
        {isCFI && (
          <>
            {HORIZ_RULE}
            <h2 className="vads-u-margin-y--3">Disagree with a decision</h2>
            <p>
              Since you disagree with part of our decision, these options may be
              a good fit for you.
            </p>
          </>
        )}
        {gfCards?.length && (
          <>
            {/* Adding a `role="list"` to `ul` with `list-style: none` to work around
            a problem with Safari not treating the `ul` as a list. */}
            {/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
            <ul className="onramp-list-none" role="list">
              {gfCards}
            </ul>
          </>
        )}
        {isCFI && (
          <>
            {HORIZ_RULE}
            {CONDITION_HAS_WORSENED_INFO}
            {CLAIM_FOR_INCREASE_CARD}
          </>
        )}
        {showOutsideDROption(formResponses)}
        {displayNotGoodFitCards(formResponses)}
        {HORIZ_RULE}
        {RESTART_GUIDE}
      </>
    ),
  };
};
