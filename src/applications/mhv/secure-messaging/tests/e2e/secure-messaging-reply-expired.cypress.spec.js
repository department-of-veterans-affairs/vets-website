import { cy } from 'date-fns/locale';
import manifest from '../../manifest.json';
import PatientMessagesLandingPage from './pages/PatientMessagesLandingPage';

describe(manifest.appName, () => {
  it('Axe Check Message Reply', () => {
    const landingPage = new PatientMessagesLandingPage();
    landingPage.login();
    landingPage.loadPage();
    cy.get('va-select#sort-order-dropdown')
      .shadow()
      .find('[id="select"]')
      .select('Oldest to newest');
    cy.get('button[type=button]')
      .contains('Sort')
      .click();
    cy.contains('Appointment Inquiry').click();
    cy.get('div#react-root h2[slot=headline]').should(
      'have.text',
      'You cannot reply to a message that is older than 45 days.',
    );
    cy.get('div#react-root h2[slot=headline]+p').should(
      'have.text',
      "Please select 'Compose' to create a new message.",
    );
    cy.injectAxe();
    cy.axeCheck();
  });
});
