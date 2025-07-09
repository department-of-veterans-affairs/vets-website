import { appName } from '../../../manifest.json';
import ApiInitializer from '../utilities/ApiInitializer';
import LandingPage from '../pages/LandingPage';

describe(`${appName} - MHV Registration Alert - `, () => {
  beforeEach(() => {
    ApiInitializer.initializeFeatureToggle.withCurrentFeatures();
  });

  context('for user without MHV account', () => {
    beforeEach(() => {
      ApiInitializer.initializeAccountStatus.with801();
      LandingPage.visit({ mhvAccountState: 'NONE' });
    });

    it(`shows a 'user action needed' alert`, () => {
      cy.injectAxeThenAxeCheck();
      cy.findByText('Error code 801: Contact the My HealtheVet help desk', {
        exact: false,
      }).should.exist;

      // Check the cards and hubs are visible
      cy.findAllByTestId(/^mhv-link-group-card-/).should.exist;
      cy.findAllByTestId(/^mhv-link-group-hub-/).should.exist;
    });

    it(`displays error card for messages`, () => {
      cy.findByText(/Error \d+: We can('|’)t give you access to messages/, {
        exact: false,
      }).should.exist;
    });

    it(`displays error card for medical records`, () => {
      cy.findByText(
        /Error \d+: We can('|’)t give you access to medical records/,
        { exact: false },
      ).should.exist;
    });

    it(`displays error card for medications`, () => {
      cy.findByText(/Error \d+: We can('|’)t give you access to medications/, {
        exact: false,
      }).should.exist;
    });
  });

  context('for non-user api errors with error code', () => {
    beforeEach(() => {
      ApiInitializer.initializeAccountStatus.with500();
      LandingPage.visit({ mhvAccountState: 'NONE' });
    });

    it('should reference a specific error', () => {
      cy.injectAxeThenAxeCheck();
      cy.findByText('Tell the representative that you received', {
        exact: false,
      }).should.exist;

      // Check the cards and hubs are visible
      cy.findAllByTestId(/^mhv-link-group-card-/).should.exist;
      cy.findAllByTestId(/^mhv-link-group-hub-/).should.exist;
    });

    it(`displays error card for messages`, () => {
      cy.findByText(
        'We’ve run into a problem and can’t give you access to Messages right now.',
        {
          exact: false,
        },
      ).should.exist;
    });

    it(`displays error card for medical records`, () => {
      cy.findByText(
        'We’ve run into a problem and can’t give you access to Medical records right now.',
        { exact: false },
      ).should.exist;
    });

    it(`displays error card for medications`, () => {
      cy.findByText(
        'We’ve run into a problem and can’t give you access to Medications right now.',
        {
          exact: false,
        },
      ).should.exist;
    });
  });

  context('for non-user api errors without error code', () => {
    beforeEach(() => {
      ApiInitializer.initializeAccountStatus.with422();
      LandingPage.visit({ mhvAccountState: 'NONE' });
    });

    it('should not reference any specific error', () => {
      'Tell the representative that you received';

      cy.injectAxeThenAxeCheck();
      cy.findByText('Tell the representative that you received', {
        exact: false,
      }).should('not.exist');

      // Check the cards and hubs are visible
      cy.findAllByTestId(/^mhv-link-group-card-/).should.exist;
      cy.findAllByTestId(/^mhv-link-group-hub-/).should.exist;
    });
  });

  context('for multiple user and non-user api errors', () => {
    beforeEach(() => {
      ApiInitializer.initializeAccountStatus.withMultipleErrors();
      LandingPage.visit({ mhvAccountState: 'NONE' });
    });
    it('refers to the same error in the alert and the card', () => {
      cy.findByText('Error code 805: Contact the My HealtheVet help desk', {
        exact: false,
      }).should.exist;

      cy.findByText('Error 805: We can’t give you access to messages', {
        exact: false,
      }).should.exist;
    });
  });

  it(`alert not shown for user with MHV account`, () => {
    LandingPage.visit({ mhvAccountState: 'OK' });
    cy.injectAxeThenAxeCheck();

    // Check the cards and hubs are visible
    cy.findAllByTestId(/^mhv-link-group-card-/).should.exist;
    cy.findAllByTestId(/^mhv-link-group-hub-/).should.exist;
  });

  it(`alert not shown for user without cached MHV account, after account status API called`, () => {
    ApiInitializer.initializeAccountStatus.withSuccess();
    LandingPage.visit({ mhvAccountState: 'NOT OK' });
    cy.injectAxeThenAxeCheck();

    // Check the cards and hubs are visible
    cy.findAllByTestId(/^mhv-link-group-card-/).should.exist;
    cy.findAllByTestId(/^mhv-link-group-hub-/).should.exist;
  });
});
