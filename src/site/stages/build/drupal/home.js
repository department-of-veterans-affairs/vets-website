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

    // Liquid does not have a good modulo operator, so we let the template know when to end a row.
    const hubs = homePageHubListQuery.itemsOfEntitySubqueueHomePageHubList.map(
      (hub, i) => {
        // We want 3 cards per row.
        if ((i + 1) % 3 === 0) {
          hub = {
            ...hub,
            endRow: true,
          };
        }
        return hub;
      },
    );

    homeEntityObj = {
      ...homeEntityObj,
      // Since homepage is not an independent node, we don't have a source for metatags. So we need to hard-code these for now.
      title: 'VA.gov Home',
      description:
        'Apply for and manage the VA benefits and services you’ve earned as a Veteran, Servicemember, or family member—like health care, disability, education, and more.',
      cards: homePageMenuQuery.links.slice(0, menuLength), // Top Tasks menu. We have a hard limit.
      hubs, // Full hub list.
      promos: homePagePromoBlockQuery.itemsOfEntitySubqueueHomePagePromos, // Promo blocks.
    };

    // Let Metalsmith know we're here.
    files[`./index.html`] = createFileObj(homeEntityObj, 'home.drupal.liquid');
  }
}

module.exports = { addHomeContent };
