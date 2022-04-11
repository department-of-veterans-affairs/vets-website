context('Keyboard Navigation', () => {
  it('navigate', () => {
    cy.visit('education/submit-school-feedback/introduction');
    cy.injectAxeThenAxeCheck();

    cy.tabToElem('.no-wrap');

    cy.tabToElem('.va-button-link.schemaform-start-button', false);

    cy.realPress('Space');

    /* */
    cy.tabToElem('[name="root_onBehalfOf"]');

    cy.chooseRadio('Myself');

    cy.tabToElem('#2-continueButton');

    cy.realPress('Space');

    /* */
    cy.tabToElem('#root_fullName_prefix');

    cy.chooseSelectOptionByTyping('Mrs.');

    cy.tabToElem('#root_fullName_first');

    cy.typeInFocused('Noah');

    cy.tabToElem('#root_fullName_middle');

    cy.typeInFocused('Michael');

    cy.tabToElem('#root_fullName_last');

    cy.typeInFocused('Gelman');

    cy.tabToElem('#root_fullName_suffix');

    cy.chooseSelectOptionByTyping('Sr.');

    cy.tabToElem('#root_serviceAffiliation');

    cy.chooseSelectOptionByTyping('Servicemember');

    cy.tabToElem('#2-continueButton');

    cy.realPress('Space');

    /* */
    cy.tabToElem('#root_serviceBranch');

    cy.chooseSelectOptionByTyping('Air Force');

    cy.tabToElem('#root_serviceDateRange_fromMonth');

    cy.chooseSelectOptionByTyping('March');

    cy.tabToElem('#root_serviceDateRange_fromDay');

    cy.chooseSelectOptionByTyping('1');

    cy.tabToElem('#root_serviceDateRange_fromYear');

    cy.typeInFocused('1990');

    cy.tabToElem('#root_serviceDateRange_toMonth');

    cy.chooseSelectOptionByTyping('May');

    cy.tabToElem('#root_serviceDateRange_toDay');

    cy.chooseSelectOptionByTyping('4');

    cy.tabToElem('#root_serviceDateRange_toYear');

    cy.typeInFocused('2020');

    cy.tabToElem('#2-continueButton');

    cy.realPress('Space');

    /* */
    cy.tabToElem('#root_address_country');

    cy.chooseSelectOptionByTyping('United States');

    cy.tabToElem('#root_address_street');

    cy.typeInFocused('12345 Test Ave.');

    cy.tabToElem('#root_address_street2');

    cy.typeInFocused('Apt 3');

    cy.tabToElem('#root_address_city');

    cy.typeInFocused('Los Angeles');

    cy.tabToElem('#root_address_state');

    cy.chooseSelectOptionByTyping('California');

    cy.tabToElem('#root_address_postalCode');

    cy.typeInFocused('90210');

    cy.tabToElem('#root_applicantEmail');

    cy.typeInFocused('noahIsCool@gmail.com');

    cy.tabToElem('[type="email"]');

    cy.typeInFocused('noahIsCool@gmail.com');

    cy.tabToElem('#root_phone');

    cy.typeInFocused('(555) 867-5309');

    cy.tabToElem('#2-continueButton');

    cy.realPress('Space');

    /* */
    cy.tabToElem('#root_educationDetails_programs_chapter35');

    cy.realPress('Space');

    cy.tabToElem(
      '[name="root_educationDetails_assistance_view:assistance_ta"]',
    );

    cy.realPress('Space');

    cy.tabToElem('[name="root_educationDetails_assistance_view:ffa_ffa"]');

    cy.realPress('Space');

    cy.tabToElem('#2-continueButton');

    cy.realPress('Space');
  });
});
