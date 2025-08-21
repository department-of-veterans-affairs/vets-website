import React from 'react';
import GoodFitCard from '../../../components/dr-results-screens/GoodFitCard';
import NotGoodFitCard from '../../../components/dr-results-screens/NotGoodFitCard';
import OverviewPanel from '../../../components/dr-results-screens/OverviewPanel';
import { DISPLAY_CONDITIONS } from '../../display-conditions';
import {
  DR_HEADING,
  HORIZ_RULE,
  PRINT_RESULTS,
  RESTART_GUIDE,
} from '../common';
import * as c from './card-content';
import { displayConditionsMet } from '../../../utilities/display-conditions';
import { showOutsideDROption } from '../../../utilities/dr-results-card-utils';

const INTRO = (
  <p>
    Based on your answers, here’s information about the options available to
    you.
  </p>
);

/**
 * Used for both "Good Fit" (white) and "Not Good Fit" (gray) cards
 * Dynamically determines the card content and evaluates what should
 * show on the card based on display conditions
 * @param {Object} formResponses - All the form answers in the Redux store
 * @param {Boolean} goodFit - A flag to indicate whether we are in the "Good Fit"
 * card section or the "Not Good Fit" card section
 * @returns
 */
const displayCards = (formResponses, goodFit) => {
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

const displayNotGoodFitCards = formResponses => {
  const cardsToDisplay = displayCards(formResponses, false);

  return (
    <>
      <h3>All other decision review options</h3>
      <p>
        Based on your answers, these choices may not fit your situation. You are
        always free to submit any claim you choose.
      </p>
      {cardsToDisplay}
    </>
  );
};

const getCardProps = formResponses => {
  return {
    h1: DR_HEADING,
    bodyContent: (
      <>
        {INTRO}
        <OverviewPanel formResponses={formResponses} />
        {PRINT_RESULTS}
        {displayCards(formResponses, true)}
        {HORIZ_RULE}
        {showOutsideDROption(formResponses)}
        {HORIZ_RULE}
        {displayNotGoodFitCards(formResponses)}
        {HORIZ_RULE}
        {RESTART_GUIDE}
      </>
    ),
  };
};

export const DR_RESULTS_CONTENT = formResponses =>
  Object.freeze({
    RESULTS_HLR: getCardProps(formResponses),
    RESULTS_SC: getCardProps(formResponses),
    RESULTS_BOARD_EVIDENCE: getCardProps(formResponses),
    RESULTS_BOARD_HEARING: getCardProps(formResponses),
    RESULTS_BOARD_DIRECT: getCardProps(formResponses),
  });
