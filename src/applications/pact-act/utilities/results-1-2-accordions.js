// Determines page content for the accordion section of Results set 1, page 2

import { RESPONSES, SHORT_NAME_MAP } from '../constants/question-data-map';
import { filterForYesResponses, getQuestionBatch } from './shared';
import { accordions } from '../constants/results-set-1-page-2-dynamic-content';

/**
 * Using the dynamic accordion data in results-set-1-page-2-accordions
 * look through form answers to see which batches (e.g. Burn pits) have responses
 * and return accordions for that batch
 */
export const getDynamicAccordions = formResponses => {
  const yesResponses = filterForYesResponses(formResponses).filter(
    shortName => shortName !== SHORT_NAME_MAP.SERVICE_PERIOD,
  );

  const matches = [];

  for (const shortName of yesResponses) {
    const batch = getQuestionBatch(shortName);

    if (!matches.includes(batch)) {
      matches.push(...accordions[batch]);
    }
  }

  return matches;
};

/**
 * There are dynamic paragraphs added in Results set 1, page 2 outside of the
 * accordion section.
 * The paragraphs require a "Yes" for a given question(s) in order to display
 * @param formResponses - Object from the store
 * @param requiredQuestions - array of question shortNames requiring a "Yes" response
 */
export const isDisplayRequirementFulfilled = (
  formResponses,
  requiredQuestions,
) => {
  let requirementsMet = false;

  for (const questionShortName of requiredQuestions) {
    const answerIsYes = shortName => formResponses[shortName] === RESPONSES.YES;

    if (requiredQuestions.length === 1) {
      // For single question requirements
      requirementsMet = answerIsYes(questionShortName);
    } else {
      // For multiple question requirements; only one "Yes" is required
      requirementsMet = requiredQuestions.some(question => {
        if (formResponses[question]) {
          return answerIsYes(question);
        }

        return false;
      });
    }
  }
  return requirementsMet;
};
