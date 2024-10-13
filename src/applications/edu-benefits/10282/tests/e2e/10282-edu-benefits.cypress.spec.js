import Timeouts from 'platform/testing/e2e/timeouts';

describe('22-10282 Edu form', () => {
  beforeEach(() => {
    cy.visit('/education/apply-for-education-benefits/10282/');
  });
  it('should show form title', () => {
    cy.injectAxeThenAxeCheck();
    cy.get('h1[data-testid="form-title"]').should('exist');
  });
  it('should go start form when user clicks "Start your application" ', () => {
    cy.injectAxeThenAxeCheck();
    cy.get('[text="Start your application"]').click();
    cy.get('[data-testid="full-name"]').should('exist');
    cy.location('href').should('contain', '/applicant/information');
  });
  it('should show errors if the Continue button is clicked while the First Name or Last Name fields are empty"', () => {
    cy.injectAxeThenAxeCheck();
    cy.get('[text="Start your application"]').click();
    cy.get('[data-testid="full-name"]').should('exist');
    cy.get('[class="usa-button-primary"]').click();
    cy.get('[id="root_veteranFullName_first-error-message"]').should(
      'contain',
      'Please enter a first name',
    );
    cy.get('[id="root_veteranFullName_last-error-message"]').should(
      'contain',
      'Please enter a last name',
    );
  });
  describe('Which of these best describes you page', () => {
    beforeEach(() => {
      cy.get('[text="Start your application"]').click();
      cy.get('[id="root_veteranFullName_first"]').type('John');
      cy.get('[id="root_veteranFullName_last"]').type('Doe');
      cy.get('[class="usa-button-primary"]').click();
    });
    it('It should proceed to the next page when required fields are not empty', () => {
      cy.injectAxeThenAxeCheck();
      cy.get('[data-dtestid="veteran-description"]').should(
        'contain',
        'Which of these best describes you?',
      );
    });
    it('should show error if veteran description field is not selected', () => {
      cy.injectAxeThenAxeCheck();
      cy.get('[class="usa-button-primary"]').click();
      cy.get('[id="root_veteranDesc-error-message"]').should(
        'contain',
        'You must select one of the options',
      );
    });
    it('should go to contact information page when required field is selected', () => {
      cy.injectAxeThenAxeCheck();
      cy.get('[class="usa-button-primary"]').click();
      cy.get('[id="root_veteranDesc_0"]', { timeout: Timeouts.slow }).click();
      cy.get('[id="root_veteranDesc_0"]', { timeout: Timeouts.slow }).should(
        'be.checked',
      );
      cy.get('[class="usa-button-primary"]').click();
    });
  });
  describe('Phone and email address', () => {
    beforeEach(() => {
      cy.get('[text="Start your application"]').click();
      cy.get('[id="root_veteranFullName_first"]').type('John');
      cy.get('[id="root_veteranFullName_last"]').type('Doe');
      cy.get('[class="usa-button-primary"]').click();
      cy.get('[class="usa-button-primary"]').click();
      cy.get('[id="root_veteranDesc_0"]', { timeout: Timeouts.slow }).click();
      cy.get('[id="root_veteranDesc_0"]', { timeout: Timeouts.slow }).should(
        'be.checked',
      );
      cy.get('[class="usa-button-primary"]').click();
    });
    it('show required error if the email field is empty', () => {
      cy.injectAxeThenAxeCheck();
      cy.get('[class="usa-button-primary"]').click();
      cy.get('[id="input-error-message"]').should(
        'contain',
        'Please enter an email address',
      );
    });
    it('should show error when email address in not in the correct format', () => {
      cy.injectAxeThenAxeCheck();
      cy.get('[name="root_contactInfo_email"]')
        .first()
        .type('someEmail', { delay: 0, waitForAnimations: false });
      cy.get('[class="usa-button-primary"]').click();
      cy.get('[id="input-error-message"]').should(
        'contain',
        'Enter a valid email address using the format email@domain.com. Your email address can only have letters, numbers, the @ symbol and a period, with no spaces.',
      );
    });
    it('shoud show Country field when there are no errors in the email field', () => {
      cy.injectAxeThenAxeCheck();
      cy.get('[name="root_contactInfo_email"]')
        .first()
        .type('someEmail@mail.com', { delay: 0, waitForAnimations: false });
      cy.get('[class="usa-button-primary"]').click();
      cy.get('[data-testid="country-field"]').should('exist');
    });
  });
  describe('Country and State fields', () => {
    beforeEach(() => {
      cy.get('[text="Start your application"]').click();
      cy.get('[id="root_veteranFullName_first"]').type('John');
      cy.get('[id="root_veteranFullName_last"]').type('Doe');
      cy.get('[class="usa-button-primary"]').click();
      cy.get('[class="usa-button-primary"]').click();
      cy.get('[id="root_veteranDesc_0"]', { timeout: Timeouts.slow }).click();
      cy.get('[id="root_veteranDesc_0"]', { timeout: Timeouts.slow }).should(
        'be.checked',
      );
      cy.get('[class="usa-button-primary"]').click();
      cy.get('[name="root_contactInfo_email"]')
        .first()
        .type('someEmail@mail.com', { delay: 0, waitForAnimations: false });
      cy.get('[class="usa-button-primary"]').click();
    });
    it('should show error if country field is not selected', () => {
      cy.injectAxeThenAxeCheck();
      cy.get('[class="usa-button-primary"]').click();
      cy.get('[id="input-error-message"]').should(
        'contain',
        'You must select a country',
      );
    });
    it('should show State filed in the next page when country field is selected to United States', () => {
      cy.injectAxeThenAxeCheck();
      cy.get('[name="root_country"]')
        .first()
        .select('United States');
      cy.get('[class="usa-button-primary"]').click();
      cy.get('[data-testid="state-title"]').should(
        'contain',
        'What state do you live in?',
      );
    });
    it('should show error if state field is not selected', () => {
      cy.injectAxeThenAxeCheck();
      cy.get('[class="usa-button-primary"]').click();
      cy.get('[name="root_country"]')
        .first()
        .select('United States');
      cy.get('[class="usa-button-primary"]').click();
      cy.get('[class="usa-button-primary"]').click();
      cy.get('[id="input-error-message"]').should(
        'contain',
        'You must select a state',
      );
    });
    it('should skip state field when country field is selected to Canada or other country', () => {
      cy.injectAxeThenAxeCheck();
      cy.get('[name="root_country"]')
        .first()
        .select('Canada');
      cy.get('[class="usa-button-primary"]').click();
      cy.get('[data-testid="optional-demographic"]').should('exist');
    });
  });
  describe('Other optional questions', () => {
    beforeEach(() => {
      cy.get('[text="Start your application"]').click();
      cy.get('[id="root_veteranFullName_first"]').type('John');
      cy.get('[id="root_veteranFullName_last"]').type('Doe');
      cy.get('[class="usa-button-primary"]').click();
      cy.get('[id="root_veteranDesc_0"]', { timeout: Timeouts.slow }).click();
      cy.get('[id="root_veteranDesc_0"]', { timeout: Timeouts.slow }).should(
        'be.checked',
      );
      cy.get('[class="usa-button-primary"]').click();
      cy.get('[name="root_contactInfo_email"]')
        .first()
        .type('someEmail@mail.com', { delay: 0, waitForAnimations: false });
      cy.get('[class="usa-button-primary"]').click();
      cy.get('[name="root_country"]')
        .first()
        .select('Canada');
      cy.get('[class="usa-button-primary"]').click();
    });
    it('should skip demographic questions and proceed to education questions if no or nothing is selected', () => {
      cy.injectAxeThenAxeCheck();
      cy.get('[class="usa-button-primary"]').click();
      cy.get('[ data-testid="ethnicity-and-race"]').should('not.exist');
    });
    it('should show the question about demographic if yes is selected', () => {
      cy.injectAxeThenAxeCheck();
      cy.get('[id="root_raceAndGender_0"]').click();
      cy.get('[id="root_raceAndGender_0"]').should('be.checked');
      cy.get('[class="usa-button-primary"]').click();
      cy.get('[ data-testid="ethnicity-and-race"]').should(
        'contain',
        'Your ethnicity and race',
      );
    });
    it('should have demographic as not required', () => {
      cy.injectAxeThenAxeCheck();
      cy.get('[id="root_raceAndGender_0"]').click();
      cy.get('[id="root_raceAndGender_0"]').should('be.checked');
      cy.get('[class="usa-button-primary"]').click();
      cy.get('[class="usa-button-primary"]').click();
      cy.get('[data-testid="gender"]').should(
        'contain',
        'How would you describe your gender?',
      );
    });
  });
  describe('education and employment history', () => {
    beforeEach(() => {
      cy.get('[text="Start your application"]').click();
      cy.get('[id="root_veteranFullName_first"]').type('John');
      cy.get('[id="root_veteranFullName_last"]').type('Doe');
      cy.get('[class="usa-button-primary"]').click();
      cy.get('[class="usa-button-primary"]').click();
      cy.get('[id="root_veteranDesc_0"]', { timeout: Timeouts.slow }).click();
      cy.get('[id="root_veteranDesc_0"]', { timeout: Timeouts.slow }).should(
        'be.checked',
      );
      cy.get('[class="usa-button-primary"]').click();
      cy.get('[name="root_contactInfo_email"]')
        .first()
        .type('someEmail@mail.com', { delay: 0, waitForAnimations: false });
      cy.get('[class="usa-button-primary"]').click();
      cy.get('[name="root_country"]')
        .first()
        .select('Canada');
      cy.get('[class="usa-button-primary"]').click();
      cy.get('[class="usa-button-primary"]').click();
    });
    it('Should have education and employment questions', () => {
      cy.injectAxeThenAxeCheck();
      cy.get('[data-testid="optional-education"]').should(
        'contain',
        'What’s the highest level of education you have completed?',
      );
    });
    it("should show a textbox if 'something else' option is selected", () => {
      cy.injectAxeThenAxeCheck();
      cy.get('[id="root_highestLevelOfEducation_level_5"]').click();
      cy.get('[data-testid="something-else-edu"]').should(
        'contain',
        'Enter the highest level of education you’ve completed.',
      );
    });
    it('should show currently employed question', () => {
      cy.injectAxeThenAxeCheck();
      cy.get('[class="usa-button-primary"]').click();
      cy.get('[data-testid="currently-employed"]').should('exist');
    });
    it('should show annual salary question', () => {
      cy.injectAxeThenAxeCheck();
      cy.get('[class="usa-button-primary"]').click();
      cy.get('[class="usa-button-primary"]').click();
      cy.get('[data-testid="annual-salary"]').should('exist');
    });
    it('should show technology question', () => {
      cy.injectAxeThenAxeCheck();
      cy.get('[class="usa-button-primary"]').click();
      cy.get('[data-testid="current-technology"]').should('exist');
    });
  });
});
