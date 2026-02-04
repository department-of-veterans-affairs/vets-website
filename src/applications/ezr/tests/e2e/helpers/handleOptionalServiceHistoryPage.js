import { goToNextPage } from '.';

export const handleOptionalServiceHistoryPage = toxicExposureCheck => {
  goToNextPage('/military-service');
  cy.location('pathname').then(path => {
    if (path.includes('/military-service/review-service-information')) {
      cy.selectYesNoVaRadioOption('root_isServiceHistoryCorrect', true);
      goToNextPage('/military-service/toxic-exposure');
    }
    cy.location('pathname').should(
      'include',
      '/military-service/toxic-exposure',
    );
    cy.selectYesNoVaRadioOption('root_view:reportDependents', false);
    cy.selectYesNoVaRadioOption(
      'root_hasTeraResponse',
      toxicExposureCheck ? 'Y' : 'N',
    );
  });
};
