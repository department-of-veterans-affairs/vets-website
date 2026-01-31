import { goToNextPage } from '.';

export const handleOptionalServiceHistoryPage = toxicExposureCheck => {
  goToNextPage('/military-service');
  cy.location('pathname').then(path => {
    if (path.includes('/military-service/review-service-information')) {
      cy.get('[name="root_isServiceHistoryCorrect"]').check('Y');
      goToNextPage('/military-service/toxic-exposure');
    }
    cy.location('pathname').should(
      'include',
      '/military-service/toxic-exposure',
    );
    cy.get('[name="root_hasTeraResponse"]').check(
      toxicExposureCheck ? 'Y' : 'N',
    );
  });
};
