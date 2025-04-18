export const HEADING_SELECTORS = [
  'div.form-panel h1',
  'div.form-panel h2',
  'div.form-panel h3',
  'div.form-panel h4',
  'div.form-panel h5',
  'div.form-panel h6',
  'div.schemaform-title h1',
  'div.schemaform-title h2',
  'div.schemaform-title h3',
  'div.schemaform-title h4',
  'div.schemaform-title h5',
  'div.schemaform-title h6',
].join(', ');

const selectorShorthand = {
  SELECT_RESIDENCE: "va-select[name='root_yourLocationOfResidence']",
  SELECT_FAMILY_MEMBER_RESIDENCE:
    "va-select[name='root_familyMembersLocationOfResidence']",
  SELECT_CATEGORY: 'va-select#root_selectCategory',
  SELECT_BRANCH_OF_SERVICE: "va-select[name='root_yourBranchOfService']",
  SELECT_MONTH: 'va-select.usa-form-group--month-select',
  TYPE_VETERAN_POSTAL_CODE: 'input#root_veteranPostalCode',
  TYPE_FAMILY_POSTAL_CODE: 'input#root_postalCode',
  TYPE_CITY_OR_POSTAL_CODE: 'input#street-city-state-zip',
  TYPE_DAY: 'va-text-input.usa-form-group--day-input',
  TYPE_YEAR: 'va-text-input.usa-form-group--year-input',
  TYPE_QUESTION: "textarea[name='root_question']",
  TYPE_SUBJECT: `input#root_subject[name="root_subject"]`,
  TYPE_FIRST_NAME: "va-text-input[name='root_aboutYourself_first']",
  TYPE_LAST_NAME: "va-text-input[name='root_aboutYourself_last']",
  TYPE_FAMILY_MEMBER_FIRST_NAME:
    "va-text-input[name='root_aboutTheFamilyMember_first']",
  TYPE_FAMILY_MEMBER_LAST_NAME:
    "va-text-input[name='root_aboutTheFamilyMember_last']",
  TYPE_FAMILY_MEMBER_SSN:
    "va-text-input[name='root_aboutTheFamilyMember_socialNum']",
  TYPE_SSN: "va-text-input[name='root_aboutYourself_socialOrServiceNum_ssn']",
  TYPE_RESIDENCE: 'input#root_locationOfResidence',
  TYPE_PHONE_NUMBER: "va-text-input[name='root_phoneNumber']",
  TYPE_BUSINESS_PHONE_NUMBER: "va-text-input[name='root_businessPhone']",
  TYPE_BUSINESS_EMAIL: "va-text-input[name='root_businessEmail']",
  TYPE_EMAIL: "va-text-input[name='root_emailAddress']",
};
/*

      case "":
      case "root_veteranPostalCode":
        selector = ``;

*/
const mapSelectorShorthand = selector => {
  if (Object.keys(selectorShorthand).includes(selector.toUpperCase())) {
    // selector = selectorShorthand[selector];
    // return selector;
    return selectorShorthand[selector];
  }

  // TODO: isn't this the  default bahavior for hashmaps anyway?
  return undefined;
};

const log = content => {
  cy.log(content);
};

const ensureExists = (content, selector = null) => {
  // cy.log('ensureExists:', selector, content);
  if (selector === null) {
    let newSelector = null;
    switch ((content ?? '').toUpperCase()) {
      case 'CATEGORY':
        newSelector = selectorShorthand.SELECT_CATEGORY;
        break;
      case 'ASK VA':
      default:
        newSelector = null;
        break;
    }
    if (newSelector === null) {
      cy.get('h1, h2, h3, h4, h5, h6', {
        includeShadowDom: true,
      })
        .contains(content)
        .should('exist');
    } else {
      cy.get(newSelector, {
        includeShadowDom: true,
      }).should('exist');
    }
  } else {
    cy.get(selector, { includeShadowDom: true })
      .contains(content)
      .should('exist');
  }
};

const clickLink = text => {
  cy.get('a', { includeShadowDom: true })
    .contains(text)
    .should('exist');
  cy.get('a', { includeShadowDom: true })
    .contains(text)
    .click();
};

const clickSearchButton = () => {
  cy.get('button#facility-search').should('exist');
  cy.get('button#facility-search').click();
};

const clickRadioButton = selector => {
  const RADIO_DEFAULT_SELECTOR = `va-radio-option[value*="${selector}"]`;
  const newSelector = mapSelectorShorthand(selector) || RADIO_DEFAULT_SELECTOR;

  cy.get(newSelector).should('exist');
  cy.get(newSelector).click();
};

const clickRadioButtonYesNo = selector => {
  const RADIO_LABEL_SELECTOR = `va-radio-option[label*="${selector}"]`;
  const newSelector = mapSelectorShorthand(selector) || RADIO_LABEL_SELECTOR;

  cy.get(newSelector).should('exist');
  cy.get(newSelector).click();
};

const clickCallToActionButton = (isPrimary = true, text) => {
  const selectorPrimary = isPrimary ? '-primary' : '';
  if (text) {
    cy.get(`.usa-button${selectorPrimary}`, { includeShadowDom: true })
      .contains(text)
      .should('exist');
    cy.get(`.usa-button${selectorPrimary}`, { includeShadowDom: true })
      .contains(text)
      .click();
  } else {
    cy.get(`.usa-button${selectorPrimary}`).should('exist');
    cy.get(`.usa-button${selectorPrimary}`).click();
  }
};

const typeText = (selector, text) => {
  const newSelector =
    mapSelectorShorthand(`TYPE_${selector}`) ||
    `va-text-input[name='${selector}']`;

  const isInShadowDOM = newSelector.indexOf('#') < 0;

  cy.get(newSelector, { includeShadowDom: true }).should('exist'); // TODO: verify this step works
  if (isInShadowDOM) {
    cy.get(newSelector, { includeShadowDom: true })
      .shadow()
      .find('input')
      .type(text);
  } else {
    cy.get(newSelector, { includeShadowDom: true }).type(text);
  }
};

const typeTextArea = (selector, text) => {
  const newSelector = mapSelectorShorthand(`TYPE_${selector}`) || selector;

  cy.get(newSelector, { includeShadowDom: true }).should('exist'); // TODO: verify this step works
  cy.get(newSelector, { includeShadowDom: true }).type(text);
  // cy.get(selector).type(text);
};

const selectOption = (selector, value) => {
  const parts = selector.split(' ');
  // selector = parts[0];

  // selector = mapSelectorShorthand(`SELECT_${selector}`) || selector;
  const newSelector = mapSelectorShorthand(`SELECT_${parts[0]}`) || parts[0];
  // if (Object.keys(selectorShorthand).includes(selector)) {
  //   selector = selectorShorthand[selector];
  // }
  // // if (selector === "root_locationOfResidence") { selector = `va-select[name="${selector}"]`; }

  const shadowSelector =
    parts.length > 1 ? parts[1] : 'select#options.usa-select';
  cy.get(newSelector, { includeShadowDom: true }).should('exist');
  cy.get(newSelector, { includeShadowDom: true })
    .shadow()
    .find(shadowSelector)
    .select(value);
  cy.get(newSelector, { includeShadowDom: true })
    .shadow()
    .find(`${shadowSelector} option:selected`)
    .should('have.value', value);
};

export default class STEPS {
  static clickLink = clickLink;

  static clickRadioButton = clickRadioButton;

  static clickRadioButtonYesNo = clickRadioButtonYesNo;

  static clickCallToActionButton = clickCallToActionButton;

  static ensureExists = ensureExists;

  static typeText = typeText;

  static typeTextArea = typeTextArea;

  static selectOption = selectOption;

  static clickSearchButton = clickSearchButton;

  static log = log;
}
