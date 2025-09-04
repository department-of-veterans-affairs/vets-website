import React from 'react';
import GoodFitCard from '../components/dr-results-screens/GoodFitCard';
import NotGoodFitCard from '../components/dr-results-screens/NotGoodFitCard';
import OverviewPanel from '../components/dr-results-screens/OverviewPanel';
import * as c from '../constants/results-content/dr-screens/card-content';
import { DISPLAY_CONDITIONS } from '../constants/display-conditions';
import { displayConditionsMet } from './display-conditions';
import {
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
          <GoodFitCard key={card} card={card} formResponses={formResponses} />,
        );
      } else {
        cardsToDisplay.push(
          <NotGoodFitCard
            key={card}
            card={card}
            formResponses={formResponses}
          />,
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
        {cardsToDisplay}
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
  return {
    h1: DR_HEADING,
    bodyContent: (
      <>
        {INTRO}
        <OverviewPanel formResponses={formResponses} />
        {PRINT_RESULTS}
        {displayCards(formResponses, true)}
        {showOutsideDROption(formResponses)}
        {displayNotGoodFitCards(formResponses)}
        {HORIZ_RULE}
        {RESTART_GUIDE}
      </>
    ),
  };
};
