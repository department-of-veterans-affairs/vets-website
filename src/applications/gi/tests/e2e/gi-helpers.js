import {
  clickButton,
  expectLocation,
  FORCE_OPTION,
  selectDropdown,
} from './cypress-helpers';
import { createId, formatCurrency } from '../../utils/helpers';
import calculatorConstantsJson from '../data/calculator-constants.json';

export const typeOfInstitution = value => {
  const selector = `input[name="category"][value="${value}"]`;
  cy.get(selector).check(FORCE_OPTION);
};

export const search = searchTerm => {
  if (searchTerm) cy.get('.keyword-search input[type="text"]').type(searchTerm);

  clickButton('#search-button');
  if (searchTerm) {
    expectLocation('/search');
  } else {
    expectLocation('/program-search');
  }
};

export const selectSearchResult = (href, checkLocation = true) => {
  clickButton(`a[href*="${href}"]`);
  if (checkLocation) expectLocation(href);
  cy.axeCheck();
};

export const displayLearnMoreModal = () => {
  cy.get('.learn-more-button')
    .first()
    .click(FORCE_OPTION);
  cy.axeCheck();
  cy.get('.va-modal-close')
    .first()
    .click(FORCE_OPTION);
};

const createAccordionButtonId = name => `#${createId(name)}-accordion-button`;

/**
 * Expand or collapse an AccordionItem and perform axe check
 * @param name button property of the AccordionItem
 */
export const clickAccordion = name => {
  cy.get(createAccordionButtonId(name))
    .first()
    .click(FORCE_OPTION);
  cy.axeCheck();
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

/**
 * Select option for "Which GI Bill benefit do you want to use?"
 * @param option
 */
export const giBillChapter = option => {
  selectDropdown('giBillChapter', option);
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
 * Click the Calculate Benefits button in EYB
 */
export const calculateBenefits = () => {
  clickButton('.calculate-button');
};

/**
 * Verifies Housing Rate on Desktop
 * @param housingRate
 */
export const checkProfileHousingRate = housingRate => {
  const housingRateId = `#calculator-result-row-${createId(
    'Housing allowance',
  )} h5`;

  cy.get(housingRateId).should('include', formatCurrency(housingRate));
};

/**
 * Verifies Housing Rate after selecting an option for "Enrolled"
 * Used if selected GI Bill benefit is ch30 or 1606 or ch35
 * Or if 31 is selected and No is answered to "Are you eligible for the Post-9/11 GI Bill?"
 * @param option
 * @param housingRate
 */
export const enrolledOld = (option, housingRate) => {
  selectDropdown('enrolledOld', option);
  calculateBenefits();
  checkProfileHousingRate(housingRate);
};

export const breadCrumb = breadCrumbHref => {
  const id = `.va-nav-breadcrumbs a[href='${breadCrumbHref}']`;
  clickButton(id);
  expectLocation(breadCrumbHref);
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

export const checkSearchResults = searchResults => {
  searchResults.data.forEach(result => {
    const resultId = `#search-result-${result.attributes.facility_code}`;
    cy.get(createId(resultId)).should('be.visible');
  });
};
