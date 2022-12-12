import manifest from '../../manifest.json';
import PatientMessageDetailsPage from './pages/PatientMessageDetailsPage';
import PatientMessagesLandingPage from './pages/PatientMessagesLandingPage';
import PatientReplyPage from './pages/PatientReplyPage';

describe(manifest.appName, () => {
  it('Axe Check Message Reply', () => {
    const landingPage = new PatientMessagesLandingPage();
    const messageDetailsPage = new PatientMessageDetailsPage();
    const replyPage = new PatientReplyPage();
    landingPage.login();
    landingPage.loadPage();
    cy.get('select')
      .eq(4)
      .click();
    // cy.get('select')
    // .eq(4)
    // .select('Oldest to newest');

    // landingPage.sortOldestToNewest();

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
