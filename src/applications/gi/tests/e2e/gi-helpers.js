import { createId, formatCurrency } from '../../utils/helpers';
import calculatorConstantsJson from '../data/calculator-constants.json';
import searchResults from '../data/search-results.json';
import vetTecSearchResults from '../data/vet-tec-search-results.json';

export const displayLearnMoreModal = () => {
  cy.get('.learn-more-button')
    .first()
    .click()
    .axeCheck()
    .get('.va-modal-close')
    .first()
    .click();
};

const createAccordionButtonId = name => `#${createId(name)}-accordion-button`;

/**
 * Expand or collapse an AccordionItem and perform axe check
 * @param name button property of the AccordionItem
 */

export const clickAccordion = name => {
  const accordionButtonId = createAccordionButtonId(name);
  cy.get(accordionButtonId)
    .should('be.visible')
    .get(accordionButtonId)
    .first()
    .click()
    .axeCheck();
};

export const checkAccordionIsExpanded = name => {
  cy.get(createAccordionButtonId(name)).should(
    'have.attr',
    'aria-expanded',
    'true',
  );
};

export const checkAccordionIsNotExpanded = name => {
  cy.get(createAccordionButtonId(name)).should(
    'have.attr',
    'aria-expanded',
    'false',
  );
};

/**
 * Main sections are expanded on page load,
 * this collapses then expands an AccordionItem
 * @param name button property of the AccordionItem
 */
export const collapseExpandAccordion = name => {
  clickAccordion(name);
  checkAccordionIsNotExpanded(name);
  clickAccordion(name);
  checkAccordionIsExpanded(name);
};

export const formatNumberHalf = value => {
  const halfVal = Math.round(value / 2);
  return formatCurrency(halfVal);
};

export const formatCurrencyHalf = value => formatNumberHalf(Math.round(+value));

const createCalculatorConstants = () => {
  const constantsList = [];
  calculatorConstantsJson.data.forEach(c => {
    constantsList[c.attributes.name] = c.attributes.value;
  });
  return constantsList;
};
export const calculatorConstants = createCalculatorConstants();

/**
 * Verifies Housing Rate on Desktop
 * @param housingRate
 */
export const checkProfileHousingRate = housingRate => {
  const housingRateId = `#calculator-result-row-${createId(
    'Housing allowance',
  )}`;

  cy.get(housingRateId).should('be.visible');

  cy.get(housingRateId).should('contain', formatCurrency(housingRate));
};

/**
 * Verifies Housing Rate after selecting an option for "Enrolled"
 * Used if selected GI Bill benefit is ch30 or 1606 or ch35
 * Or if 31 is selected and No is answered to "Are you eligible for the Post-9/11 GI Bill?"
 * @param option
 * @param housingRate
 */
export const enrolledOld = (option, housingRate) => {
  cy.get('select[name="enrolledOld"]').select(option);
  cy.get('.calculate-button').click();
  checkProfileHousingRate(housingRate);
};

export const breadCrumb = breadCrumbHref => {
  cy.get(`.va-nav-breadcrumbs a[href='${breadCrumbHref}']`)
    .click()
    .url()
    .should('include', breadCrumbHref);
};

const eybSections = {
  yourMilitaryDetails: 'Your military details',
  schoolCostsAndCalendar: 'School costs and calendar',
  learningFormat: 'Learning format and location',
  scholarshipsAndOtherVAFunding: 'Scholarships and other VA funding',
};

const eybAccordionExpandedCheck = (sections, section) => {
  checkAccordionIsExpanded(section);
  Object.values(sections)
    .filter(value => value !== section)
    .forEach(value => checkAccordionIsNotExpanded(value));
};

/**
 * Opens section and performs generic checks
 * Should NOT include question checks
 * @param clickToOpen
 * @param sectionName
 * @param sections
 */
export const checkSectionAccordion = (
  clickToOpen,
  sectionName,
  sections = eybSections,
) => {
  if (clickToOpen) {
    clickAccordion(sections[sectionName]);
  } else {
    const id = createAccordionButtonId(sections[sectionName]);
    cy.get(id).axeCheck();
  }
  eybAccordionExpandedCheck(sections, sections[sectionName]);
};

export const verifySearchResults = (results = searchResults) => {
  cy.url().should('include', `/search`);
  cy.get('.search-page').should('be.visible');

  results.data.forEach(({ attributes: profile }) => {
    cy.get(`#search-result-${profile.facility_code}`).should('be.visible');
  });
};

export const verifyVetTecSearchResults = (results = vetTecSearchResults) => {
  results.data.forEach(result => {
    const resultId = `#search-result-${result.attributes.facility_code}-${
      result.attributes.description
    }`;
    cy.get(createId(resultId)).should('be.visible');
  });
};
