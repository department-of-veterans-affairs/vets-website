describe('Accessibility', () => {
  it('Traverses content via keyboard', () => {
    cy.visit('/education/school-administrators/');
    cy.injectAxe();
    cy.axeCheck();
    // First focusable element in react app
    cy.get('va-breadcrumbs')
      .shadow()
      .find('nav li > a')
      .first()
      .focus();
    cy.focused().should('contain.text', 'VA.gov home');
    cy.realPress('Tab');
    cy.focused().should('contain.text', 'Resources for schools');
    // Tab to 'On this Page' links
    cy.realPress('Tab');
    cy.get('va-on-this-page').focused();
    cy.focused().should('contain.text', 'Handbooks');
    cy.realPress('Tab');
    cy.realPress('Tab');
    cy.realPress('Tab');
    cy.realPress('Tab');
    cy.focused().should('contain.text', 'Other resources for schools');
    // Tab to 'Handbooks' links
    cy.realPress('Tab');
    cy.focused().should('contain.text', 'School Certifying Official Handbook');
    cy.realPress('Tab');
    cy.realPress('Tab');
    cy.focused().should(
      'contain.text',
      'VR&E School Certifying Official Handbook',
    );
    // Tab to 'Trainings and webinars' links
    cy.realPress('Tab');
    cy.focused().should('contain.text', 'Training Requirements');
    cy.realPress('Tab');
    cy.realPress('Tab');
    cy.realPress('Tab');
    cy.realPress('Tab');
    cy.focused().should('contain.text', 'GovDelivery Message Archive');
    // Tab to 'Program approval information' links
    cy.realPress('Tab');
    cy.focused().should('contain.text', 'WEAMS Institution Search');
    cy.realPress('Tab');
    cy.realPress('Tab');
    cy.realPress('Tab');
    cy.realPress('Tab');
    cy.realPress('Tab');
    cy.realPress('Tab');
    cy.realPress('Tab');
    cy.realPress('Tab');
    cy.focused().should(
      'contain.text',
      'State Approving Agency Contact Information',
    );
    // Tab to 'Upload files to VA' section
    cy.realPress('Tab');
    cy.focused().should('contain.text', 'Education File Upload Portal');
    cy.realPress('Tab');
    cy.focused().should('contain.text', 'Expand all +');
    cy.realPress('Enter');
    cy.focused().should('contain.text', 'Collapse all -');
    cy.realPress('Tab');
    cy.focused().should(
      'contain.text',
      'Forms library and other accepted documents',
    );
    cy.realPress('Tab');
    cy.focused().should(
      'contain.text',
      'Designation of Certifying Official(s) - VA Form 22-8794 (PDF, 3 pages)',
    );
    cy.realPress('Tab');
    cy.realPress('Tab');
    cy.realPress('Tab');
    cy.realPress('Tab');
    cy.focused().should(
      'contain.text',
      'Conflicting Interests Certification for Proprietary Schools - VA Form 22-1919 (PDF, 1 page)',
    );
    // Tab to 'Other resources for schools' section
    cy.realPress('Tab');
    cy.focused().should('contain.text', 'Expand all +');
    cy.realPress('Enter');
    cy.focused().should('contain.text', 'Collapse all -');
    cy.realPress('Tab');
    cy.focused().should('contain.text', 'Enrollment Manager');
    cy.realPress('Tab');
    cy.focused().should('contain.text', 'Launch VA Education Platform Portal');
    cy.realPress('Tab');
    cy.realPress('Tab');
    cy.realPress('Tab');
    cy.realPress('Tab');
    cy.realPress('Tab');
    cy.realPress('Tab');
    cy.realPress('Tab');
    cy.realPress('Tab');
    cy.focused().should(
      'contain.text',
      'VA Paper Based Forms to Enrollment Manager Crosswalk (PPTX, 124 pages)',
    );
    cy.realPress('Tab');
    cy.focused().should('contain.text', 'Payment and debt');
    cy.realPress('Tab');
    cy.realPress('Tab');
    cy.realPress('Tab');
    cy.realPress('Tab');
    cy.focused().should(
      'contain.text',
      'Veteran Readiness and Employment (VR&E) Chapter 31',
    );
    cy.realPress('Tab');
    cy.focused().should(
      'contain.text',
      'VR&E School Certifying Official Handbook',
    );
    cy.realPress('Tab');
    cy.realPress('Tab');
    cy.realPress('Tab');
    cy.realPress('Tab');
    cy.realPress('Tab');
    cy.realPress('Tab');
    cy.focused().should('contain.text', 'How to apply for VR&E');
    cy.realPress('Tab');
    cy.focused().should('contain.text', '85/15');
    cy.realPress('Tab');
    cy.realPress('Tab');
    cy.realPress('Tab');
    cy.realPress('Tab');
    cy.realPress('Tab');
    cy.realPress('Tab');
    cy.realPress('Tab');
    cy.realPress('Tab');
    cy.realPress('Tab');
    cy.realPress('Tab');
    cy.focused().should('contain.text', 'About GI Bill Benefits');
    cy.realPress('Tab');
    cy.realPress('Tab');
    cy.realPress('Tab');
    cy.realPress('Tab');
    // Should be focused on right panel now
    cy.focused().should('contain.text', 'Access Enrollment Manager');
    cy.realPress('Tab');
    cy.focused().should('contain.text', 'Expand all +');
    // Tab to 'Ask questions' section
    cy.realPress('Tab');
    cy.focused().should('contain.text', 'Ask questions');
    cy.realPress('Tab');
    cy.realPress('Tab');
    cy.realPress('Tab');
    cy.realPress('Tab');
    cy.realPress('Tab');
    cy.realPress('Tab');
    cy.realPress('Tab');
    cy.realPress('Tab');
    cy.realPress('Tab');
    cy.realPress('Tab');
    cy.realPress('Tab');
    cy.realPress('Tab');
    cy.realPress('Tab');
    cy.realPress('Tab');
    // Tab to 'Connect with us' section
    cy.realPress('Tab');
    cy.focused().should('contain.text', 'Connect with us');
    cy.realPress('Tab');
    cy.realPress('Tab');
    cy.realPress('Tab');
    cy.realPress('Tab');
    cy.realPress('Tab');
    cy.focused().should('contain.text', 'VBA on YouTube');
  });
});
