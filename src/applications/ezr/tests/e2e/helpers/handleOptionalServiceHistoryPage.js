import { goToNextPage } from '.';

export const handleOptionalServiceHistoryPage = ({
  historyEnabled = false,
  hasTeraYes = false,
} = {}) => {
  if (historyEnabled) {
    goToNextPage('/military-service/review-service-information');
    cy.selectYesNoVaRadioOption('root_isServiceHistoryCorrect', true);
  }
  goToNextPage('/military-service/toxic-exposure');
  cy.selectYesNoVaRadioOption('root_hasTeraResponse', hasTeraYes);
};
