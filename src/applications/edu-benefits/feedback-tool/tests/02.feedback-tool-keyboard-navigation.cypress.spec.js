context('Keyboard Navigation', () => {
  it.skip('navigate', () => {
    cy.visit('education/submit-school-feedback/introduction');
    cy.injectAxeThenAxeCheck();

    /**
     * On GI Bill School Feedback Tool tab to start application without signing in, then proceed.
     */
    cy.tabToElement('.no-wrap');

    cy.tabToElement('.schemaform-start-button', false);

    cy.realPress('Enter');

    /**
     * Complete initial page of Step 1 of 5: Applicant Information.
     */
    cy.tabToElement('[name="root_onBehalfOf"]');

    // cy.chooseRadio('Myself');
    cy.get('va-radio-option[value="Myself"]').click();

    cy.tabToElement('#2-continueButton');

    cy.realPress('Space');

    /**
     * Complete next page of Step 1 of 5: Applicant Information.
     */
    cy.tabToElement('#root_fullName_prefix');

    cy.chooseSelectOptionByTyping('Mr.');

    cy.tabToElement('#root_fullName_first');

    cy.typeInFocused('John');

    cy.tabToElement('#root_fullName_middle');

    cy.typeInFocused('Michael');

    cy.tabToElement('#root_fullName_last');

    cy.typeInFocused('Smith');

    cy.tabToElement('#root_fullName_suffix');

    cy.chooseSelectOptionByTyping('Sr.');

    cy.tabToElement('#root_serviceAffiliation');

    cy.chooseSelectOptionByTyping('Servicemember');

    cy.tabToElement('#2-continueButton');

    cy.realPress('Space');

    /**
     * Complete next page of Step 1 of 5: Applicant Information.
     */
    cy.tabToElement('#root_serviceBranch');

    cy.chooseSelectOptionByTyping('Air Force');

    cy.tabToElement('#root_serviceDateRange_fromMonth');

    cy.chooseSelectOptionByTyping('March');

    cy.tabToElement('#root_serviceDateRange_fromDay');

    cy.chooseSelectOptionByTyping('1');

    cy.tabToElement('#root_serviceDateRange_fromYear');

    cy.typeInFocused('1990');

    cy.tabToElement('#root_serviceDateRange_toMonth');

    cy.chooseSelectOptionByTyping('May');

    cy.tabToElement('#root_serviceDateRange_toDay');

    cy.chooseSelectOptionByTyping('4');

    cy.tabToElement('#root_serviceDateRange_toYear');

    cy.typeInFocused('2020');

    cy.tabToElement('#2-continueButton');

    cy.realPress('Space');

    /**
     * Complete next page of Step 1 of 5: Applicant Information.
     */
    cy.tabToElement('#root_address_country');

    cy.chooseSelectOptionByTyping('United States');

    cy.tabToElement('#root_address_street');

    cy.typeInFocused('12345 Test Ave.');

    cy.tabToElement('#root_address_street2');

    cy.typeInFocused('Apt 3');

    cy.tabToElement('#root_address_city');

    cy.typeInFocused('Los Angeles');

    cy.tabToElement('#root_address_state');

    cy.chooseSelectOptionByTyping('California');

    cy.tabToElement('#root_address_postalCode');

    cy.typeInFocused('90210');

    cy.tabToElement('#root_applicantEmail');

    cy.typeInFocused('jsmith98223@gmail.com');

    cy.tabToElement('[type="email"]');

    cy.typeInFocused('jsmith98223@gmail.com');

    cy.tabToElement('#root_phone');

    cy.typeInFocused('(555) 867-5309');

    cy.tabToElement('#2-continueButton');

    cy.realPress('Space');

    /**
     * Complete Step 2 of 5: Education Benefits.
     */
    cy.tabToElement('#root_educationDetails_programs_chapter35');

    cy.realPress('Space');

    cy.tabToElement(
      '[name="root_educationDetails_assistance_view:assistance_ta"]',
    );

    cy.realPress('Space');

    cy.tabToElement('[name="root_educationDetails_assistance_view:ffa_ffa"]');

    cy.realPress('Space');

    cy.tabToElement('#2-continueButton');

    cy.realPress('Space');
  });
});
