import manifest from '../../manifest.json';
import vetData from './fixtures/data/veteran.json';
import vetOhrData from './fixtures/data/veteranOtherHousingRisks.json';
import nonVetData from './fixtures/data/nonVeteran.json';
import thirdPartyVetData from './fixtures/data/thirdPartyVeteran.json';
import thirdPartyNonVetData from './fixtures/data/thirdPartyNonVeteran.json';
import {
  LIVING_SITUATIONS,
  LIVING_SITUATIONS_3RD_PTY_VET,
  LIVING_SITUATIONS_3RD_PTY_NON_VET,
  PREPARER_TYPES,
  OTHER_REASONS,
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

export const getTestData = dataStory => {
  switch (dataStory) {
    case 'veteran':
      return vetData.data;
    case 'veteranOhr':
      return vetOhrData.data;
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

export const showsCorrectLivingSituationCheckboxLabels = story => {
  let livingSituations;
  switch (story) {
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

export const fillNameAndDateOfBirthPage = story => {
  const data = getTestData(story);
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

export const fillIdInfoPage = story => {
  const data = getTestData(story);

  cy.get('input[name="root_id_ssn"]').type(data.id.ssn, { force: true });
};

export const fillLivingSituationPage = story => {
  const data = getTestData(story);
  const livingSituations = data.livingSituation;

  Object.keys(livingSituations).forEach(key => {
    cy.selectVaCheckbox(`root_livingSituation_${key}`, livingSituations[key]);
  });
};

export const fillOtherHousingRisksPage = story => {
  const data = getTestData(story);
  const { otherHousingRisks } = data;

  cy.get('textarea[name="root_otherHousingRisks"]').type(otherHousingRisks, {
    force: true,
  });
};

export const fillMailingAddressPage = story => {
  const data = getTestData(story);
  const { mailingAddress } = data;
  const { country, street, city, state, postalCode } = mailingAddress;
  const countryDropdownSelector = 'select[name="root_mailingAddress_country"]';
  const stateDropdownSelector = 'select[name="root_mailingAddress_state"]';

  cy.get(countryDropdownSelector).should('not.be.disabled');
  cy.get(countryDropdownSelector).select(country);
  cy.get('input[name="root_mailingAddress_street"]').type(street, {
    force: true,
  });
  cy.get('input[name="root_mailingAddress_city"]').type(city, { force: true });
  cy.get(stateDropdownSelector).should('not.be.disabled');
  cy.get(stateDropdownSelector).select(state);
  cy.get('input[name="root_mailingAddress_postalCode"]').type(postalCode, {
    force: true,
  });
};

export const fillPhoneAndEmailPage = story => {
  const data = getTestData(story);
  const { phone } = data;

  cy.get('input[name="root_phone"]').type(phone, { force: true });
};

export const showsCorrectOtherReasonsLabels = () => {
  const otherReasonsKeys = Object.keys(OTHER_REASONS);
  const otherReasonsKeysLength = otherReasonsKeys.length;

  cy.get('va-checkbox-group[name="root_otherReasons"] va-checkbox').should(
    'have.length',
    otherReasonsKeysLength,
  );

  otherReasonsKeys.forEach(key => {
    cy.get(
      `va-checkbox-group[name="root_otherReasons"] va-checkbox[data-key="${key}"]`,
    ).should('have.attr', 'label', OTHER_REASONS[key]);
  });
};

export const fillOtherReasonsPage = story => {
  const data = getTestData(story);
  const { otherReasons } = data;

  Object.keys(otherReasons).forEach(key => {
    cy.selectVaCheckbox(`root_otherReasons_${key}`, otherReasons[key]);
  });
};
