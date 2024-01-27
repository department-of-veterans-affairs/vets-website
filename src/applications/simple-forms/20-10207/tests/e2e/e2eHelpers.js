import manifest from '../../manifest.json';
import vetData from './fixtures/data/veteran.json';
import nonVetData from './fixtures/data/non-veteran.json';
import thirdPartyVetData from './fixtures/data/third-party-veteran.json';
import thirdPartyNonVetData from './fixtures/data/third-party-non-veteran.json';
import {
  LIVING_SITUATIONS,
  LIVING_SITUATIONS_3RD_PTY_VET,
  LIVING_SITUATIONS_3RD_PTY_NON_VET,
  PREPARER_TYPES,
} from '../../config/constants';

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

export const showsCorrectLivingSituationCheckboxLabels = preparerType => {
  let livingSituations;
  switch (preparerType) {
    case PREPARER_TYPES.THIRD_PARTY_VETERAN:
      livingSituations = LIVING_SITUATIONS_3RD_PTY_VET;
      break;
    case PREPARER_TYPES.THIRD_PARTY_NON_VETERAN:
      livingSituations = LIVING_SITUATIONS_3RD_PTY_NON_VET;
      break;
    default:
      livingSituations = LIVING_SITUATIONS;
  }
  const situationKeys = Object.keys(livingSituations);
  const situationsLength = situationKeys.length;

  cy.get('va-checkbox-group[name="root_livingSituation"] va-checkbox').should(
    'have.length',
    situationsLength,
  );

  situationKeys.forEach(key => {
    cy.get(
      `va-checkbox-group[name="root_livingSituation"] va-checkbox[data-key="${key}"]`,
    ).should('have.attr', 'label', livingSituations[key]);
  });
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

export const fillLivingSituationPage = preparerType => {
  const data = getDataForPreparerType(preparerType);
  const livingSituations = data.livingSituation;

  Object.keys(livingSituations).forEach(key => {
    cy.selectVaCheckbox(`root_livingSituation_${key}`, livingSituations[key]);
  });
};

export const fillOtherHousingRisksPage = preparerType => {
  const data = getDataForPreparerType(preparerType);
  const { otherHousingRisks } = data;

  cy.get('textarea[name="root_otherHousingRisks"]').type(otherHousingRisks, {
    force: true,
  });
};
