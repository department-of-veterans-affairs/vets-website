const E2eHelpers = require('../../e2e/e2e-helpers');
const Timeouts = require('../../e2e/timeouts.js');

const exploreButton = '#vetnav-menu button[aria-controls="vetnav-explore"]';
const benefitsButton = '#vetnav-menu button[aria-controls="vetnav-benefits"]';
const facilitiesLink = '#vetnav-menu a[href="/facilities/"]';
const openControl = '.vetnav-controller-open';

module.exports = E2eHelpers.createE2eTest(
  (client) => {
    const { SPACE, ENTER, UP_ARROW, DOWN_ARROW, LEFT_ARROW, RIGHT_ARROW, ESCAPE, TAB } = client.Keys;

    client
      .url(`${E2eHelpers.baseUrl}/`);

    E2eHelpers.overrideSmoothScrolling(client);

    // landing page
    client
      .waitForElementVisible('body', Timeouts.normal)
      // Make sure everything is where we think it should be
      .waitForElementVisible(exploreButton, Timeouts.slow)
      .waitForElementVisible(benefitsButton, Timeouts.slow)
      .waitForElementVisible(facilitiesLink, Timeouts.slow)
      // do not run 'wcag2a' rules because of open aXe bug https://github.com/dequelabs/axe-core/issues/214
      .axeCheck('.main');

    // ------------------------ //
    // --- Small menu tests --- //
    // ------------------------ //

    client.resizeWindow(425, 887);

    // Enter small menu
    client.focusOn(openControl)
      .keys(ENTER)
      .assert.isActiveElement('vetnav-level1');

    client
      .keys(ESCAPE)
      .assert.isActiveElement('vetnav-controller-open');

    // Exit small menu
    client.focusOn(openControl)
      .keys(ENTER)
      .keys(TAB)
      .keys(TAB)
      .keys(TAB)
      .keys(TAB)
      .expect.element('#vetnav').to.not.be.visible;

    // Restore client to normal size
    client.resizeWindow(1024, 768);

    // --------------------- //
    // --- Menubar tests --- //
    // --------------------- //

    // Explore benefits menu items
    const firstMenuItem = 'button[aria-controls="vetnav-disability"]';
    const secondMenuItem = 'button[aria-controls="vetnav-healthcare"]';
    const lastMenuItem = 'button[aria-controls="vetnav-burials"]';

    const testOpenExploreMenu = (key, focusedOn, keyName) => {
      if (keyName) {
        client.log(`   Testing opening the explore menu with ${keyName}`);
      }

      client.expect.element('#vetnav-explore').to.not.be.visible;
      client.focusOn(exploreButton)
        .keys(key)
        .expect.element('#vetnav-explore').to.be.visible;

      // TODO: Uncomment this when the code that does this for clicking is merged into master
      // client.assert.isActiveElement(focusedOn);

      // Close the menu behind us
      client.click(exploreButton);
    };
    // Space, enter, and the down arrow should open menu, focus on first element
    testOpenExploreMenu(SPACE, firstMenuItem, 'space');
    testOpenExploreMenu(ENTER, firstMenuItem, 'enter');
    testOpenExploreMenu(DOWN_ARROW, firstMenuItem, 'down arrow');

    // Up arrow should open menu, focus on last element
    testOpenExploreMenu(UP_ARROW, lastMenuItem, 'down arrow');

    // Right arrow should move focus to the right
    client.focusOn(exploreButton)
      .keys(RIGHT_ARROW)
      .assert.isActiveElement(benefitsButton.selector, benefitsButton.attribute);
    //  with wraparound
    client.focusOn(facilitiesLink)
      .keys(RIGHT_ARROW)
      .assert.isActiveElement(exploreButton.selector, exploreButton.attribute);

    // Left arrow should move focus to the left
    client.focusOn(benefitsButton)
      .keys(LEFT_ARROW)
      .assert.isActiveElement(exploreButton.selector, exploreButton.attribute);
    //  with wraparound
    client.focusOn(exploreButton)
      .keys(LEFT_ARROW)
      .assert.isActiveElement(facilitiesLink.selector, facilitiesLink.selector);


    // ------------------------------ //
    // --- First-level menu tests --- //
    // ------------------------------ //

    // Health care sub menu items
    const hcFirstItem = '#vetnav-healthcare a[href="/health-care/"]';
    const hcSecondItem = '#vetnav-healthcare a[href="/health-care/eligibility/"]';
    const hcLastItem = '#vetnav-healthcare a[href="/health-care/apply/application/"]';

    // Disability menu items
    // const disFirstItem = '#vetnav-disability a[href="/disability-benefits/"]';

    // Open the menu
    client.click(exploreButton);

    // Down arrow should move focus to the next element
    client
      .focusOn(firstMenuItem)
      .keys(DOWN_ARROW)
      .assert.isActiveElement(secondMenuItem.selector, secondMenuItem.attribute);
    //  with wraparound
    client
      .focusOn(lastMenuItem)
      .keys(DOWN_ARROW)
      .assert.isActiveElement(firstMenuItem.selector, firstMenuItem.attribute);

    // Up arrow should move focus to the previous element
    client
      .focusOn(secondMenuItem)
      .keys(UP_ARROW)
      .assert.isActiveElement(firstMenuItem.selector, firstMenuItem.attribute);
    //  with wraparound going to the opening menu button
    client
      .focusOn(firstMenuItem)
      .keys(UP_ARROW)
      .assert.isActiveElement(exploreButton.selector, exploreButton.attribute);

    // Left arrow should do nothing
    client
      .focusOn(firstMenuItem)
      .keys(LEFT_ARROW)
      .assert.isActiveElement(firstMenuItem.selector, firstMenuItem.attribute);

    // Right arrow should open the sub-menu and focus on the first element if sub-menu exists
    client.expect.element('#vetnav-healthcare').to.not.be.visible;
    client
      .focusOn(secondMenuItem)
      .keys(RIGHT_ARROW)
      .assert.visible('#vetnav-healthcare');
    client.assert.isActiveElement(hcFirstItem.selector, hcFirstItem.attribute);

    // Space should open the sub-menu and focus on the first element if sub-menu exists
    client.expect.element('#vetnav-disability').to.not.be.visible;
    client
      .focusOn(firstMenuItem)
      .keys(SPACE)
      .assert.visible('#vetnav-disability');
    // TODO: Uncomment this when the code that makes this work is merged in
    // client.assert.isActiveElement(disFirstItem);

    // Enter should open the sub-menu and focus on the first element if sub-menu exists
    client.expect.element('#vetnav-healthcare').to.not.be.visible;
    client
      .focusOn(secondMenuItem)
      .keys(ENTER)
      .assert.visible('#vetnav-healthcare');
    // TODO: Uncomment this when the code that makes this work is merged in
    // client.assert.isActiveElement(hcFirstItem);


    // -- Non-sub menu buttons -- //
    const prescriptionsLink = 'a[href="/health-care/prescriptions"]';

    client.click(benefitsButton);

    // Right arrow should do nothing if no sub-menu exists
    client
      .focusOn(prescriptionsLink)
      .keys(RIGHT_ARROW)
      .assert.visible(prescriptionsLink);

    // TODO: Write these; I'm not sure what to do with them
    //  Do we just poke them and test the url? Seems like it'd get pretty slow
    // Space should follow the link if the menu item is a link
    // Enter should follow the link if the menu item is a link

    client.click(exploreButton); // Open our explore menu back up again


    // ---------------------- //
    // --- Sub-menu tests --- //
    // ---------------------- //

    client.click(secondMenuItem); // Open up the health care menu

    // Down arrow should move focus to the next item
    client
      .focusOn(hcFirstItem)
      .keys(DOWN_ARROW)
      .assert.isActiveElement(hcSecondItem.selector, hcSecondItem.attribute);
    //  with wraparound
    client
      .focusOn(hcLastItem)
      .keys(DOWN_ARROW)
      .assert.isActiveElement(hcFirstItem.selector, hcFirstItem.attribute);

    // Up arrow should move focus to the previous item
    client
      .focusOn(hcSecondItem)
      .keys(UP_ARROW)
      .assert.isActiveElement(hcFirstItem.selector, hcFirstItem.attribute);
    //  with wraparound
    client
      .focusOn(hcFirstItem)
      .keys(UP_ARROW)
      .assert.isActiveElement(hcLastItem.selector, hcLastItem.attribute);

    // Right arrow should do nothing
    client
      .focusOn(hcFirstItem)
      .keys(RIGHT_ARROW)
      .assert.isActiveElement(hcFirstItem.selector, hcFirstItem.attribute);

    // Left arrow should move focus back to the opening menu button
    client
      .focusOn(hcFirstItem)
      .keys(LEFT_ARROW)
      .assert.isActiveElement(secondMenuItem.selector, secondMenuItem.attribute);

    // TODO: Write these; I'm not sure what to do with them
    //  Do we just poke them and test the url? Seems like it'd get pretty slow
    // Space should follow links
    // Enter should follow links


    // --------------------------- //
    // --- Miscellaneous tests --- //
    // --------------------------- //

    // Escape should close all menus
    //  Should focus be doing anything special here? When hitting tab, it goes to the next menubar item
    client.assert.visible('#vetnav-explore');
    client
      .keys(ESCAPE)
      .expect.element('#vetnav-explore').to.not.be.visible;

    client.end();
  });

