import { UPDATED_USER_MOCK_DATA } from '../../constants/mockData';
import { mockUser, notVerifiedUser } from './login';

// Testing Start enrollment verification
describe('Enrollment Verification Page Tests', () => {
  beforeEach(() => {
    cy.login(mockUser);
    cy.intercept('GET', '/vye/v1', {
      statusCode: 200,
      body: UPDATED_USER_MOCK_DATA,
    });
    cy.intercept('GET', '/v0/feature_toggles?*', { statusCode: 200 });
    cy.intercept('GET', '/data/cms/vamc-ehr.json', { statusCode: 200 });
    cy.visit('/education/verify-school-enrollment/mgib-enrollments/', {
      onBeforeLoad: win => {
        /* eslint no-param-reassign: "error" */
        win.isProduction = true;
      },
    });
  });

  it('should display the enrollment verification breadcrumbs', () => {
    cy.injectAxeThenAxeCheck();
    cy.get('[id="vye-periods-to-verify-container"]').should('exist');
  });
  it('should show "Student Verification of Enrollment (VA Form 22-8979)"', () => {
    cy.injectAxeThenAxeCheck();
    cy.get(
      '.vye-mimic-va-button.vads-u-font-family--sans.vads-u-margin-top--0',
    ).click();
    cy.get('.va-introtext').should(
      'contain',
      'Student Verification of Enrollment (VA Form 22-8979)',
    );
    cy.url().should('include', '/verify-information');
    cy.get('.vye-highlighted-content-container').should('exist');
  });
  it('should show the submit button not disabled when radio button is checked', () => {
    cy.injectAxeThenAxeCheck();
    cy.get(
      '.vye-mimic-va-button.vads-u-font-family--sans.vads-u-margin-top--0',
    ).click();
    cy.get('[id="enrollmentCheckbox"]').click();
    cy.get('[text="Submit"]').should('not.be.disabled');
  });
  it('should go back to previous screen when Go Back button is clicked', () => {
    cy.injectAxeThenAxeCheck();
    cy.get(
      '.vye-mimic-va-button.vads-u-font-family--sans.vads-u-margin-top--0',
    ).click();
    cy.get('[class="usa-button usa-button--outline"]').click({
      multiple: true,
    });
    cy.url().should('include', '/mgib-enrollments');
    cy.get('[id="montgomery-gi-bill-enrollment-statement"]').should(
      'contain',
      'Montgomery GI Bill enrollment verificatio',
    );
  });
  it('should show error message when submit button is clicked and something went wrong', () => {
    cy.injectAxeThenAxeCheck();
    cy.get('[data-testid="have-not-verified"]')
      .should('be.visible')
      .and('contain', 'You haven’t verified your enrollment for the month.');
    cy.get(
      '.vye-mimic-va-button.vads-u-font-family--sans.vads-u-margin-top--0',
    ).click();
    cy.get('[id="enrollmentCheckbox"]').click();
    cy.get('[text="Submit"]').click();
    cy.get('[class="vads-u-margin-y--0"]').should(
      'contain',
      ' We’re sorry. Something went wrong on our end. Please try again',
    );
    cy.get(
      '[class="vads-u-font-size--h4 vads-u-display--flex vads-u-align-items--center"]',
    ).should('contain', 'Verified');
  });
  it("should go back to 'enrollment verification' when 'Verify your school enrollment' link is clicked ", () => {
    cy.injectAxeThenAxeCheck();
    cy.get(
      'a[href="/education/verify-school-enrollment/mgib-enrollments/benefits-profile/"]',
    ).click({ multiple: true });
    cy.get('a[href="/education/verify-school-enrollment/mgib-enrollments/"]')
      .first()
      .click({ multiple: true });
    cy.url().should('not.include', '/benefits-profile');
  });
  it("should  have focus around 'Showing x-y of z monthly enrollments listed by most recent' when pagination button is clicked", () => {
    cy.injectAxeThenAxeCheck();
    cy.get('a[aria-label="page 1, first page"]').click();
    cy.get('[id="vye-pagination-page-status-text"]').should('be.focused');
  });

  it('Should shows You currently have no enrollments if user is not part og VYE ', () => {
    cy.injectAxeThenAxeCheck();
    cy.intercept('GET', '/vye/v1', {
      statusCode: 403,
      body: {
        error: 'Forbidden',
      },
    });
    cy.visit('/education/verify-school-enrollment/mgib-enrollments/', {
      onBeforeLoad: win => {
        /* eslint no-param-reassign: "error" */
        win.isProduction = true;
      },
    });
    cy.get(
      'span[class="vads-u-font-weight--bold vads-u-display--block vads-u-margin-top--2"]',
    ).should('contain', 'You currently have no enrollments.');
  });

  it("Should return This page isn't available right now if there is 500 error ", () => {
    cy.injectAxeThenAxeCheck();
    cy.intercept('GET', '/vye/v1', {
      statusCode: 500,
      body: {
        errors: [
          {
            title: 'Internal server error',
            detail: 'Internal server error',
            code: '500',
            status: '500',
          },
        ],
      },
    }).as('getServerError');

    cy.visit('/education/verify-school-enrollment/mgib-enrollments/', {
      onBeforeLoad: win => {
        /* eslint no-param-reassign: "error" */
        win.isProduction = true;
      },
    });

    cy.wait('@getServerError').then(interception => {
      expect(interception.response.statusCode).to.equal(500);
      expect(interception.response.body.errors[0].title).to.equal(
        'Internal server error',
      );
    });
    cy.get('[slot="headline"]').should(
      'contain',
      "This page isn't available right now.",
    );
  });
  it("Should return 'You currently have no enrollments to verify.' if a user is new", () => {
    cy.injectAxeThenAxeCheck();
    const enrollmentData = {
      ...UPDATED_USER_MOCK_DATA['vye::UserInfo'],
      pendingVerifications: [],
      verifications: [],
    };
    cy.intercept('GET', '/vye/v1', {
      statusCode: 200,
      body: enrollmentData,
    });

    cy.visit('/education/verify-school-enrollment/mgib-enrollments/', {
      onBeforeLoad: win => {
        /* eslint no-param-reassign: "error" */
        win.isProduction = true;
      },
    });
    cy.get(
      'span[class="vads-u-font-weight--bold vads-u-display--block vads-u-margin-top--2"]',
    ).should('contain', 'You currently have no enrollments to verify.');
  });
  it("Should return 'You currently have no enrollments.' if a user is not part of VYE", () => {
    cy.injectAxeThenAxeCheck();

    cy.intercept('GET', '/vye/v1', {
      statusCode: 403,
      body: { error: 'Forbidden' },
    });

    cy.visit('/education/verify-school-enrollment/mgib-enrollments/', {
      onBeforeLoad: win => {
        /* eslint no-param-reassign: "error" */
        win.isProduction = true;
      },
    });
    cy.get(
      'span[class="vads-u-font-weight--bold vads-u-display--block vads-u-margin-top--2"]',
    ).should('contain', 'You currently have no enrollments.');
  });
  it('should show n/a if deldate is null and indicator is A', () => {
    cy.injectAxeThenAxeCheck();
    const enrollmentData = {
      ...UPDATED_USER_MOCK_DATA['vye::UserInfo'],
    };
    cy.intercept('GET', '/vye/v1', {
      statusCode: 200,
      body: enrollmentData,
    });
  });
  it('show required error message when button is click and the checkbox is not checked', () => {
    cy.injectAxeThenAxeCheck();
    cy.get('[data-testid="have-not-verified"]')
      .should('be.visible')
      .and('contain', 'You haven’t verified your enrollment for the month.');
    cy.get(
      '.vye-mimic-va-button.vads-u-font-family--sans.vads-u-margin-top--0',
    ).click();
    cy.get('[text="Submit"]').click();
    cy.get('[id="root_educationType-error-message"]').should(
      'contain',
      'Please check the box to confirm the information is correct.',
    );
  });
  it('should show not verified Alert if user is not verified', () => {
    cy.injectAxeThenAxeCheck();
    cy.login(notVerifiedUser);
    cy.visit('/education/verify-school-enrollment/mgib-enrollments/', {
      onBeforeLoad: win => {
        /* eslint no-param-reassign: "error" */
        win.isProduction = true;
      },
    });
    cy.get('a[href="/verify"]').should('contain', 'Verify your identity');
  });
});
