describe('Accessibility', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/v0/feature_toggles*', {
      data: {
        type: 'feature_toggles',
        features: [
          { name: 'form_1919_release', value: true },
          { name: 'form_8794_release', value: true },
          { name: 'form_10275_release', value: true },
        ],
      },
    }).as('featureToggles');
    cy.intercept('GET', '/data/cms/vamc-ehr.json', { statusCode: 200 });
  });
  /* eslint-disable cypress/unsafe-to-chain-command */
  it('Traverses content via keyboard', () => {
    cy.visit('/school-administrators');
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
    cy.repeatKey('Tab', 4);
    cy.focused().should('contain.text', 'Other resources for schools');
    // Tab to 'Handbooks' links

    cy.realPress('Tab');
    cy.focused().should(
      'contain.text',
      'Understanding Veteran education benefits',
    );
    cy.repeatKey('Tab', 2);
    // Employer’s Certification Handbook On-The-Job Training & Apprenticeship Programs
    cy.focused().should(
      'contain.text',
      'Employer’s Certification Handbook On-The-Job Training & Apprenticeship Programs',
    );

    cy.repeatKey('Tab', 2);
    cy.focused().should('contain.text', 'Training requirements');
    cy.repeatKey('Tab', 4);
    cy.focused().should('contain.text', 'GovDelivery Message Archive');
    // Tab to 'Program approval information' links
    cy.realPress('Tab');
    cy.focused().should('contain.text', 'GI Bill® Comparison Tool');
    cy.repeatKey('Tab', 11);
    cy.focused().should(
      'contain.text',
      'State Approving Agency contact information',
    );
    // Tab to 'Upload files to VA' section
    cy.realPress('Tab');
    cy.focused().should('contain.text', 'Education File Upload Portal');
    cy.realPress('Tab');
    cy.focused().should('contain.text', 'Expand all');
    cy.repeatKey('Tab', 5);
    // Tab to 'Other resources for schools' section
    cy.realPress('Enter');
    cy.realPress('Tab');
    cy.focused().should('contain.text', 'Launch VA Education Platform Portal');
    cy.repeatKey('Tab', 8);
    cy.focused().should(
      'contain.text',
      'VA Paper-Based Forms to Enrollment Manager Crosswalk (PPTX, 124 pages)',
    );
    // Tab to 'Other resources New SCO Toolkit' section
    cy.realPress('Tab');
    cy.focused().should('contain.text', 'New SCO Toolkit');
    cy.realPress('Enter');
    cy.realPress('Tab');
    cy.focused().should('contain.text', 'New SCO Toolkit');
    cy.realPress('Tab');
    cy.focused().should('contain.text', 'Getting Started as an SCO');
    cy.realPress('Tab');
    cy.focused().should('contain.text', 'Role of the SCO');
    cy.realPress('Tab');
    cy.focused().should('contain.text', 'Required Training');
    cy.realPress('Tab');
    cy.focused().should('contain.text', 'Gaining Access to Enrollment Manager');
    cy.realPress('Tab');
    cy.focused().should('contain.text', 'Certification Basics');
    cy.realPress('Tab');
    cy.focused().should('contain.text', 'SCO Responsibilities to the SAA');
    cy.realPress('Tab');
    cy.focused().should('contain.text', 'Compliance and Reporting');
    cy.realPress('Tab');
    cy.focused().should('contain.text', 'Common Mistakes to Avoid');
    cy.realPress('Tab');
    cy.focused().should('contain.text', 'Resources and Support');

    cy.realPress('Tab');
    cy.focused().should('contain.text', 'Payment and debt');
    cy.realPress('Enter');
    cy.repeatKey('Tab', 4);
    cy.focused().should(
      'contain.text',
      'Veteran Readiness and Employment (VR&E) Chapter 31',
    );
    cy.realPress('Enter');
    cy.realPress('Tab');
    cy.focused().should(
      'contain.text',
      'VR&E School Certifying Official Handbook',
    );
    cy.repeatKey('Tab', 6);
    cy.focused().should('contain.text', 'How to apply for VR&E');
    cy.repeatKey('Tab', 2);
    cy.focused().should('contain.text', '85/15');
    cy.realPress('Enter');
    cy.repeatKey('Tab', 11);
    cy.focused().should('contain.text', 'About GI Bill benefits');
    cy.repeatKey('Tab', 6);
    // Should be focused on right panel now
    cy.focused().should('contain.text', 'Access Enrollment Manager');
    cy.realPress('Tab');
    cy.focused().should('contain.text', 'Expand all');
    // Tab to 'Ask questions' section
    cy.repeatKey('Tab', 2);
    cy.focused().should('contain.text', 'Ask questions');
    cy.repeatKey('Tab', 11);
    // Tab to 'Connect with us' section
    cy.focused().should('contain.text', 'Connect with us');
    cy.repeatKey('Tab', 5);
    cy.focused().should('contain.text', 'X');
  });
});
