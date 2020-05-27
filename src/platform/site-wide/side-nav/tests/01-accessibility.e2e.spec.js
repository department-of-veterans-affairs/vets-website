const E2eHelpers = require('../../../testing/e2e/helpers');

module.exports = E2eHelpers.createE2eTest(client => {
  client.openUrl(`${E2eHelpers.baseUrl}/pittsburgh-health-care/`);
  E2eHelpers.overrideSmoothScrolling(client);
  /**
   * Start at the breadcrumbs links
   */
  client.sendKeys(
    '#va-breadcrumbs-list > li:nth-child(1) > a',
    client.Keys.TAB,
  );
  client.keys(client.Keys.TAB);
  client.assert.isActiveElement(
    '#va-sidenav-ul-container > li:nth-child(2) > ul > li:nth-child(1) > a',
  );

  /**
   * Tab access the links on the left nav and verify active link elements
   */
  client.keys(client.Keys.TAB);
  client.assert.isActiveElement(
    '#va-sidenav-ul-container > li:nth-child(2) > ul > li:nth-child(2) > a',
  );
  client.keys(client.Keys.TAB);
  client.assert.isActiveElement(
    '#va-sidenav-ul-container > li:nth-child(3) > ul > li:nth-child(1) > a',
  );
  client.keys(client.Keys.TAB);
  client.assert.isActiveElement(
    '#va-sidenav-ul-container > li:nth-child(3) > ul > li:nth-child(2) > a',
  );
  client.keys(client.Keys.TAB);
  client.assert.isActiveElement(
    '#va-sidenav-ul-container > li:nth-child(3) > ul > li:nth-child(3) > a',
  );
  client.keys(client.Keys.TAB);
  client.assert.isActiveElement(
    '#va-sidenav-ul-container > li:nth-child(4) > ul > li:nth-child(1) > a',
  );
  client.keys(client.Keys.TAB);
  client.assert.isActiveElement(
    '#va-sidenav-ul-container > li:nth-child(4) > ul > li:nth-child(2) > a',
  );
  client.keys(client.Keys.TAB);
  client.assert.isActiveElement(
    '#va-sidenav-ul-container > li:nth-child(4) > ul > li:nth-child(3) > a',
  );
  client.keys(client.Keys.TAB);
  client.assert.isActiveElement(
    '#va-sidenav-ul-container > li:nth-child(4) > ul > li:nth-child(4) > a',
  );
  client.keys(client.Keys.TAB);
  client.assert.isActiveElement(
    '#va-sidenav-ul-container > li:nth-child(4) > ul > li:nth-child(5) > a',
  );
  client.keys(client.Keys.TAB);
  client.assert.isActiveElement(
    '#va-sidenav-ul-container > li:nth-child(4) > ul > li:nth-child(6) > a',
  );

  /**
   * Focus on first level item and navigate to the page
   */
  client.sendKeys(
    '#va-sidenav-ul-container > li:nth-child(2) > ul > li:nth-child(1) > a',
    client.Keys.TAB,
  );
  client.click(
    '#va-sidenav-ul-container > li:nth-child(2) > ul > li:nth-child(2) > a',
  );

  /**
   * Tab access its children items
   */
  client.sendKeys(
    '#va-sidenav-ul-container > li:nth-child(2) > ul > li:nth-child(2) > a',
    client.Keys.TAB,
  );
  client.assert.isActiveElement(
    '#va-sidenav-ul-container > li:nth-child(2) > ul > li.va-sidenav-level-2.active.selected > ul > li:nth-child(1) > a',
  );
  client.keys(client.Keys.TAB);
  client.assert.isActiveElement(
    '#va-sidenav-ul-container > li:nth-child(2) > ul > li.va-sidenav-level-2.active.selected > ul > li:nth-child(2) > a',
  );
  //
  client.keys(client.Keys.TAB);
  client.assert.isActiveElement(
    '#va-sidenav-ul-container > li:nth-child(2) > ul > li.va-sidenav-level-2.active.selected > ul > li:nth-child(3) > a',
  );
  client.keys(client.Keys.TAB);
  client.assert.isActiveElement(
    '#va-sidenav-ul-container > li:nth-child(2) > ul > li.va-sidenav-level-2.active.selected > ul > li:nth-child(4) > a',
  );
  client.keys(client.Keys.TAB);
  client.assert.isActiveElement(
    '#va-sidenav-ul-container > li:nth-child(2) > ul > li.va-sidenav-level-2.active.selected > ul > li:nth-child(5) > a',
  );
  client.keys(client.Keys.TAB);
  client.assert.isActiveElement(
    '#va-sidenav-ul-container > li:nth-child(2) > ul > li.va-sidenav-level-2.active.selected > ul > li:nth-child(6) > a',
  );
  client.keys(client.Keys.TAB);
  client.assert.isActiveElement(
    '#va-sidenav-ul-container > li:nth-child(2) > ul > li.va-sidenav-level-2.active.selected > ul > li:nth-child(7) > a',
  );

  /**
   * Navigate to level 2 (child item) page
   */
  client.sendKeys(
    '#va-sidenav-ul-container > li:nth-child(2) > ul > li:nth-child(2) > a',
    client.Keys.TAB,
  );
  client.click(
    '#va-sidenav-ul-container > li:nth-child(2) > ul > li.va-sidenav-level-2.active.selected > ul > li:nth-child(1) > a',
  );

  /**
   * Verify is now level 3 , page open
   */
  client.sendKeys(
    '#va-sidenav-ul-container > li:nth-child(2) > ul > li:nth-child(2) > a',
    client.Keys.TAB,
  );
  client.assert.isActiveElement(
    '#va-sidenav-ul-container > li:nth-child(2) > ul > li.va-sidenav-level-2.selected > ul > li.va-sidenav-level-3.active > a',
  );
});

module.exports['@disabled'] = true;
