import { clickButton, expectLocation, FORCE_OPTION } from './cypress-helpers';
import { createId } from '../../utils/helpers';

export const typeOfInstitution = value => {
  const selector = `input[name="category"][value="${value}"]`;
  cy.get(selector).check(FORCE_OPTION);
};

export const search = () => {
  clickButton('search-button');
};

export const selectSearchResult = (href, checkLocation = true) => {
  cy.get(`a[href*="${href}"]`)
    .first()
    .click(FORCE_OPTION);

  if (checkLocation) expectLocation(href.replace(/\s/g, '%20'));
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
