import { appName } from '../../../manifest.json';
import ApiInitializer from '../utilities/ApiInitializer';
import LandingPage from '../pages/LandingPage';
import AlertMhvUserAction from '../../../components/alerts/AlertMhvUserAction.jsx';

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
      cy.findByText(AlertMhvUserAction.defaultProps.title, { exact: false })
        .should.exist;

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

  it(`alert not shown for user with MHV account`, () => {
    LandingPage.visit({ mhvAccountState: 'OK' });
    cy.injectAxeThenAxeCheck();
    cy.findByText(AlertMhvUserAction.defaultProps.title, {
      exact: false,
    }).should('not.exist');

    // Check the cards and hubs are visible
    cy.findAllByTestId(/^mhv-link-group-card-/).should.exist;
    cy.findAllByTestId(/^mhv-link-group-hub-/).should.exist;
  });

  it(`alert not shown for user without cached MHV account, after account status API called`, () => {
    ApiInitializer.initializeAccountStatus.withSuccess();
    LandingPage.visit({ mhvAccountState: 'NOT OK' });
    cy.injectAxeThenAxeCheck();
    cy.findByText(AlertMhvUserAction.defaultProps.title, {
      exact: false,
    }).should('not.exist');

    // Check the cards and hubs are visible
    cy.findAllByTestId(/^mhv-link-group-card-/).should.exist;
    cy.findAllByTestId(/^mhv-link-group-hub-/).should.exist;
  });
});
