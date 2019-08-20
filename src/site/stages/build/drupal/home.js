/* eslint-disable no-param-reassign, no-continue */
const { createEntityUrlObj, createFileObj } = require('./page');

// Processes the data received from the home page query.
function addHomeContent(contentData, files) {
  // We cannot limit menu items in Drupal, so we must do it here.
  const menuLength = 4;

  // Make sure that we have content for the home page.
  if (contentData.data.homePageMenuQuery) {
    let homeEntityObj = createEntityUrlObj('/');
    const {
      data: {
        homePageMenuQuery,
        homePageHubListQuery,
        homePagePromoBlockQuery,
      },
    } = contentData;

    homeEntityObj = {
      ...homeEntityObj,
      cards: homePageMenuQuery.links.slice(0, menuLength), // Top Tasks menu. We have a hard limit.
      hubs: homePageHubListQuery.itemsOfEntitySubqueueHomePageHubList, // Full hub list.
      promos: homePagePromoBlockQuery.itemsOfEntitySubqueueHomePagePromos, // Promo blocks.
    };

    // Let Metalsmith know we're here.
    files[`./index.html`] = createFileObj(homeEntityObj, 'home.drupal.liquid');
  }
}

module.exports = { addHomeContent };
