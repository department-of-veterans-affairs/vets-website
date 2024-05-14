import * as headerFooterData from '~/platform/landing-pages/header-footer-data.json';

const headerData = headerFooterData.megaMenuData;
export const ABOUT_VA = 'About VA';

export const verifyElement = selector =>
  cy
    .get(selector)
    .should('exist')
    .should('be.visible');

export const verifyText = (selector, text) =>
  cy
    .get(selector)
    .should('exist')
    .should('be.visible')
    .contains(text);

export const clickButton = selector => cy.get(selector).click();

export const verifyLink = (id, linkText, href) => {
  const link = () => cy.get(id).eq(0);

  link()
    .should('exist')
    .should('be.visible')
    .contains(linkText)
    .should('have.attr', 'href')
    .and('include', href);
};

export const verifyLinkWithoutSelector = (index, text, href) =>
  cy
    .get('a')
    .eq(index)
    .should('be.visible')
    .should('contain.text', text)
    .should('have.attr', 'href')
    .and('include', href);

export const verifyHeaderWithoutSelector = (index, text) =>
  cy
    .get('h3')
    .eq(index)
    .should('be.visible')
    .should('contain.text', text);

// Verify section exists (i.e. VA Benefits and Health Care)
const getSectionData = sectionName => {
  return headerData?.filter(section => section.title === sectionName)[0];
};

// Verify given Benefit Hub category exists inside VA Benefits and Health Care (i.e. Health care, Disability)
export const getMenuCategoryData = categoryName => {
  const sectionData = getSectionData('VA Benefits and Health Care');

  return sectionData?.menuSections?.filter(
    category => category.title === categoryName,
  )?.[0];
};

// Get all column data for About VA
export const getColumnsDataForAboutVA = () => {
  const aboutVAInfo = headerData.filter(
    section => section.title === ABOUT_VA,
  )[0];

  return Object.values(aboutVAInfo.menuSections).filter(
    group => group?.links?.length,
  );
};

const getColumns = menuCategory =>
  Object.keys(menuCategory.links).filter(
    group => group.includes('column') || group.includes('Column'),
  );

export const getColumnHeadersForBH = menuCategory => {
  const columnHeaders = [];
  const columns = getColumns(menuCategory);

  for (const column of columns) {
    if (menuCategory.links?.[column]?.title) {
      columnHeaders.push(menuCategory.links?.[column]?.title);
    }
  }

  return columnHeaders;
};

// Get all links for VA Benefits and Health Care
export const getColumnLinksForBHLinks = menuCategory => {
  const columnLinks = [];
  const columns = getColumns(menuCategory);

  for (const column of columns) {
    if (menuCategory.links?.[column]?.links?.length) {
      columnLinks.push(...menuCategory.links?.[column]?.links);
    }
  }

  return columnLinks;
};

export const verifyMenuItemsForMobile = (menuLinkButton, columnLinks) => {
  // Click category button (i.e. Health care, disability)
  menuLinkButton().click();

  const backToMenuButton = () => cy.get('#header-back-to-menu');
  verifyElement('#header-back-to-menu');

  verifyElement(backToMenuButton);

  const headerMenu = () => cy.get('.header-menu');

  headerMenu()
    .scrollIntoView()
    .within(() => {
      for (const [index, link] of columnLinks.entries()) {
        // index + 1 skips over the View All link since that has already been verified
        verifyLinkWithoutSelector(index + 1, link.text, link.href);
      }
    });
};

export const verifyMenuItemsForDesktop = (
  menuLinkButton,
  viewAllSelector,
  columnLinks,
  columnHeaders,
) => {
  const submenuContainer = () => cy.get('#vetnav-va-benefits-and-health-care');
  verifyElement(submenuContainer);

  // Click category button (i.e. Health care, disability)
  verifyElement(menuLinkButton);
  clickButton(menuLinkButton);

  submenuContainer()
    .scrollIntoView()
    .within(() => {
      // Verify view all link exists and is correct
      verifyText(viewAllSelector, 'View all');

      for (const [index, link] of columnLinks.entries()) {
        // index + 1 skips over the View All link since that has already been verified
        verifyLinkWithoutSelector(index + 1, link.text, link.href);
      }

      for (const [index, header] of columnHeaders.entries()) {
        verifyHeaderWithoutSelector(index, header);
      }
    });
};

export const clickBenefitsAndHealthcareButton = () => {
  const vaBenefitsAndHealthCareButton =
    '[data-e2e-id="va-benefits-and-health-care-0"]';
  verifyElement(vaBenefitsAndHealthCareButton);
  clickButton(vaBenefitsAndHealthCareButton);
};

export const clickBenefitsAndHealthcareButtonMobile = () => {
  const vaBenefitsAndHealthCareButton = () =>
    cy.get('.header-menu-item-button').eq(0);
  vaBenefitsAndHealthCareButton().click();
};

export const clickMenuButton = () => {
  const menuSelector = '.header-menu-button';
  verifyElement(menuSelector);
  clickButton(menuSelector);
};
