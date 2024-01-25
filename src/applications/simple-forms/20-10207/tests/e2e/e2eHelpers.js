import manifest from '../../manifest.json';
import vetData from './fixtures/data/veteran.json';
import nonVetData from './fixtures/data/non-veteran.json';
import thirdPartyVetData from './fixtures/data/third-party-veteran.json';
import thirdPartyNonVetData from './fixtures/data/third-party-non-veteran.json';

const { rootUrl } = manifest;

export const continueToNextPage = () => {
  cy.findAllByText(/Continue/)
    .first()
    .click();
};

export const pagePathIsCorrect = pagePath => {
  cy.location('pathname').should('eq', `${rootUrl}/${pagePath}`);
};

export const showsCorrectChapterTitle = titleText => {
  cy.contains(titleText, {
    selector: '.use-step-indicator__heading-text',
  }).should('be.visible');
};

export const showsCorrectPageTitle = (titleText, headerLevel) => {
  cy.contains(titleText, {
    selector: `legend h${headerLevel}`,
  }).should('be.visible');
};

export const getDataForPreparerType = preparerType => {
  switch (preparerType) {
    case 'veteran':
      return vetData.data;
    case 'non-veteran':
      return nonVetData.data;
    case 'third-party-veteran':
      return thirdPartyVetData.data;
    case 'third-party-non-veteran':
      return thirdPartyNonVetData.data;
    default:
      return vetData.data;
  }
};

export const showsCorrectErrorMessage = message => {
  cy.contains(message, {
    selector: 'span.usa-error-message',
  }).should('be.visible');
};

export const fillNameAndDateOfBirthPage = preparerType => {
  const data = getDataForPreparerType(preparerType);
  const dob = data.dateOfBirth.split('-');

  cy.get('input[name="root_fullName_first"]').type(data.fullName.first, {
    force: true,
  });
  cy.get('input[name="root_fullName_last"]').type(data.fullName.last, {
    force: true,
  });
  cy.get('select[name="root_dateOfBirthMonth"]').select(
    parseInt(dob[1], 10).toString(),
  );
  cy.get('input[name="root_dateOfBirthDay"]').type(
    parseInt(dob[2], 10).toString(),
    { force: true },
  );
  cy.get('input[name="root_dateOfBirthYear"]').type(dob[0], { force: true });
};

export const fillIdInfoPage = preparerType => {
  const data = getDataForPreparerType(preparerType);

  cy.get('input[name="root_id_ssn"]').type(data.id.ssn, { force: true });
};
