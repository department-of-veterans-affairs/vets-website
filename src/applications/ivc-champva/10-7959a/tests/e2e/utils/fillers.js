import { goToNextPage } from './helpers';

export const uploadDocumentAndGoToNext = pathToFile => {
  cy.get('input[type="file"]')
    .upload(pathToFile, 'testing')
    .get('.schemaform-file-uploading')
    .should('not.exist');
  cy.injectAxeThenAxeCheck();
  goToNextPage();
};
