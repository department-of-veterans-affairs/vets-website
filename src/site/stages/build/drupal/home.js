/* eslint-disable no-param-reassign, no-continue */
const { createEntityUrlObj, createFileObj } = require('./page');

function addHomeContent(contentData, files) {
  const menuLength = 4;
  const hubListLength = 11;
  const promoBlockLength = 3;
  const homeEntityObj = createEntityUrlObj('/');
  const {
    data: { homePageMenuQuery, homePageHubListQuery, homePagePromoBlockQuery },
  } = contentData;

  homeEntityObj.cards = homePageMenuQuery.links.slice(0, menuLength);
  homeEntityObj.hubs = homePageHubListQuery.itemsOfEntitySubqueueHomePageHubList.slice(
    0,
    hubListLength,
  );
  homeEntityObj.promos = homePagePromoBlockQuery.itemsOfEntitySubqueueHomePagePromos.slice(
    0,
    promoBlockLength,
  );

  files[`./index.html`] = createFileObj(homeEntityObj, 'home.drupal.liquid');
}

module.exports = { addHomeContent };
