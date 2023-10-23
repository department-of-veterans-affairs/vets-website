import * as staticHeaderData from '~/platform/landing-pages/header-footer-data.json';

const headerData = staticHeaderData.megaMenuData;
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

// Verify given Benefit Hub category exists inside VA Benefits and Health Care (i.e. Health care, Disability)
const getStaticMenuCategory = (
  staticSectionData,
  categoryName,
  sectionName,
) => {
  const staticMenuCategory = staticSectionData?.menuSections?.filter(
    category => category.title === categoryName,
  );

  if (!staticMenuCategory?.length || staticMenuCategory.length > 1) {
    throw new Error(
      `Update the header-footer-data.json file; the ${sectionName} menu has zero or multiple of this category: ${categoryName}`,
    );
  }

  return staticMenuCategory[0];
};

// Verify section exists (i.e. VA Benefits and Health Care)
const getStaticSectionData = sectionName => {
  const staticSectionData = headerData?.filter(
    section => section.title === sectionName,
  );

  if (!staticSectionData?.length || staticSectionData.length > 1) {
    throw new Error(
      `Update the header-footer-data.json file; this section has zero or multiple matches: ${sectionName}`,
    );
  }

  return staticSectionData[0];
};

// Verify view all link exists and is correct
export const verifyStaticSeeAllLink = (staticMenuCategory, viewAll) => {
  if (staticMenuCategory?.links?.seeAllLink) {
    const staticSeeAllData = staticMenuCategory.links.seeAllLink;

    if (
      staticSeeAllData.text !== viewAll.text ||
      !staticSeeAllData.href.includes(viewAll.href)
    ) {
      throw new Error(
        `Update the header-footer-data.json file; the data for this viewAll link does not match prod: ${
          viewAll.text
        }`,
      );
    }
  } else {
    throw new Error(
      `Update the header-footer-data.json file; the data for this viewAll link does not match prod: ${
        viewAll.text
      }`,
    );
  }
};

// Get all column data for About VA
export const getStaticColumnsDataForAboutVA = () => {
  const aboutVAInfo = headerData.filter(
    section => section.title === ABOUT_VA,
  )[0];

  if (!aboutVAInfo) {
    throw new Error(
      `Unable to find match for About VA section in header-footer-data.json`,
    );
  }

  return Object.values(aboutVAInfo.menuSections).filter(
    group => group?.links?.length,
  );
};

// Get all links for VA Benefits and Health Care
const getStaticColumnLinksForBHLinks = (staticMenuCategory, categoryName) => {
  const columnLinks = [];
  const columns = Object.keys(staticMenuCategory.links).filter(
    group => group.includes('column') || group.includes('Column'),
  );

  for (const column of columns) {
    if (staticMenuCategory.links?.[column]?.links?.length) {
      columnLinks.push(...staticMenuCategory.links?.[column]?.links);
    }
  }

  if (!columnLinks?.length) {
    throw new Error(
      `Update the header-footer-data.json file; the column data for ${categoryName} does not match prod`,
    );
  }

  return columnLinks;
};

export const verifyMenuItems = (
  menuLinkButton,
  menuHeadings,
  menuLinks,
  viewAll,
  categoryName,
) => {
  const SECTION_NAME = 'VA Benefits and Health Care';
  // Click category button (i.e. Health care, disability)
  verifyElement(menuLinkButton);
  clickButton(menuLinkButton);

  const staticSectionData = getStaticSectionData(SECTION_NAME);
  const staticMenuCategory = getStaticMenuCategory(
    staticSectionData,
    categoryName,
    SECTION_NAME,
  );

  // Verify view all link exists and is correct
  verifyLink(`[data-e2e-id*="${viewAll.id}"]`, viewAll.text, viewAll.href);
  verifyStaticSeeAllLink(staticMenuCategory, viewAll);

  const columnLinks = getStaticColumnLinksForBHLinks(
    staticMenuCategory,
    categoryName,
  );

  if (menuLinks?.length !== columnLinks?.length) {
    throw new Error(
      `Mismatch of number of links between header-footer-data.json and ${categoryName} links`,
    );
  }

  for (const [index, link] of menuLinks.entries()) {
    const staticLink = columnLinks?.[index];

    if (!staticLink) {
      throw new Error(
        `No matching link found in header-footer-data.json for ${link.text}`,
      );
    }

    if (
      staticLink?.text !== link.text ||
      !staticLink?.href.includes(link.href)
    ) {
      throw new Error(
        `No matching link found in header-footer-data.json for ${link}`,
      );
    }

    verifyLink(`[data-e2e-id*="${link.id}"]`, link.text, link.href);
  }

  for (const heading of menuHeadings) {
    verifyText(heading.id, heading.text);
  }
};
