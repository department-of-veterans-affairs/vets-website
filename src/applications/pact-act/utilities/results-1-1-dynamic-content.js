// Determines page content for the dynamic section of Results set 1, page 1

import { dynamicContent } from '../constants/results-set-1-page-1-dynamic-content';
import { getNonNullShortNamesFromStore } from './shared';
import { SHORT_NAME_MAP } from '../constants/question-data-map';

/**
 * Using the available dynamic content from results-set-1-page-1-dynamic-content,
 * compare the answers in the form against the requirements for dynamic content.
 * Return whatever matches
 */
export const getDynamicContent = formResponses => {
  // Final content to show on the results page
  const dynamicContentMatchingAnswer = [];

  // Get array of short names with responses in the store minus SERVICE_PERIOD and any question ending in '_A'
  // For questions that are A/B pairs (a radio question first, then a set of checkboxes)
  // we don't need to check the radio answer, only the checkboxes (based on criteria in dynamicContent)
  const answeredQuestions = getNonNullShortNamesFromStore(
    formResponses,
  )?.filter(shortName => {
    return (
      shortName !== SHORT_NAME_MAP.SERVICE_PERIOD && !shortName.endsWith('_A')
    );
  });

  for (const shortName of answeredQuestions) {
    const formAnswer = formResponses[shortName];

    for (const dataForOneQuestion of dynamicContent[shortName]) {
      // For checkbox answers
      const dynamicContentMatchesArrayAnswer =
        Array.isArray(formAnswer) &&
        formAnswer.includes(dataForOneQuestion.response);

      const dynamicContentMatchesStringAnswer =
        formAnswer === dataForOneQuestion.response;

      if (
        dynamicContentMatchesArrayAnswer ||
        dynamicContentMatchesStringAnswer
      ) {
        dynamicContentMatchingAnswer.push(dataForOneQuestion.content);
      }
    }
  }

  return dynamicContentMatchingAnswer;
};
