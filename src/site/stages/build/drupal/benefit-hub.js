/* eslint-disable no-param-reassign, no-continue */

// Adds the title icon field from a benefits hub landing page to its associated detail pages.
function addHubIconField(page, pages) {
  const rootPath = `/${page.entityUrl.path.split('/')[1]}`;
  const landingPage = pages.find(
    // Find the corresponding landing page for this detail page.
    p => p.entityBundle === 'landing_page' && p.entityUrl.path === rootPath,
  );

  // If we found a landing page, grab the icon field.
  if (landingPage) {
    page.fieldTitleIcon = landingPage.fieldTitleIcon;
  }
}

module.exports = { addHubIconField };
