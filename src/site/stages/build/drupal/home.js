/* eslint-disable no-param-reassign, no-continue */
const { createEntityUrlObj, createFileObj } = require('./page');

// Processes the data received from the home page query.
function addHomeContent(contentData, files) {
  const menuLength = 4;
  const hubListLength = 11;
  const promoBlockLength = 3;

  if (contentData.data.homePageMenuQuery) {
    const homeEntityObj = createEntityUrlObj('/');
    const {
      data: {
        homePageMenuQuery,
        homePageHubListQuery,
        homePagePromoBlockQuery,
      },
    } = contentData;

    // Add Top Tasks Menu.
    homeEntityObj.cards = homePageMenuQuery.links.slice(0, menuLength);

    // Add full hub list.
    homeEntityObj.hubs = homePageHubListQuery.itemsOfEntitySubqueueHomePageHubList.slice(
      0,
      hubListLength,
    );

    // Add promo blocks.
    homeEntityObj.promos = homePagePromoBlockQuery.itemsOfEntitySubqueueHomePagePromos.slice(
      0,
      promoBlockLength,
    );

    files[`./index.html`] = createFileObj(homeEntityObj, 'home.drupal.liquid');
  }
}

module.exports = { addHomeContent };
