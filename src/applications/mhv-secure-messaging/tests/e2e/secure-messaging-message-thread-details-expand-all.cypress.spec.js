import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
// import inboxMessages from './fixtures/messages-response.json';
import threadResponse from './fixtures/thread-response-new-api.json';
// import mockMessageDetails from './fixtures/message-response.json';
// import mockParentMessageDetails from './fixtures/message-specialCharacter-response.json';
// import defaultMockThread from './fixtures/thread-response.json';
import PatientMessageDetailsPage from './pages/PatientMessageDetailsPage';
import { AXE_CONTEXT } from './utils/constants';

// describe('Secure Messaging Message Details', () => {
//   const messageDetails = mockMessageDetails;
//   const date = new Date();
//
//   before('Axe Check Message Details Page', () => {
//     SecureMessagingSite.login();
//     date.setDate(date.getDate() - 2);
//     messageDetails.data.attributes.sentDate = date.toISOString();
//     cy.log(`New Message Details ==== ${JSON.stringify(messageDetails)}`);
//     PatientInboxPage.loadInboxMessages(inboxMessages, messageDetails);
//     PatientMessageDetailsPage.loadMessageDetails(
//       messageDetails,
//       defaultMockThread,
//       1,
//       mockParentMessageDetails,
//     );
//   });
//
//   it('Expanded All Messages Contain all details without additional calls', () => {
//     // const updatedMockThread = detailsPage.getCurrentThread();
//     PatientMessageDetailsPage.verifyExpandedMessageTo(
//       mockParentMessageDetails,
//       0,
//     );
//
//     PatientMessageDetailsPage.expandAllThreadMessages();
//
//     PatientMessageDetailsPage.verifyExpandedThreadBody(defaultMockThread, 2);
//     PatientMessageDetailsPage.verifyExpandedThreadAttachment(
//       defaultMockThread,
//       2,
//     );
//     cy.get('@allMessageDetails.all').should('have.length', 0);
//     cy.injectAxe();
//     cy.axeCheck(AXE_CONTEXT, {
//       rules: { 'aria-allowed-role': { enabled: true } },
//     });
//   });
// });

describe('SM EXPAND ALL ACCORDIONS', () => {
  const updatedThreadResponse = threadResponse;
  const date = new Date();
  updatedThreadResponse.data[0].attributes.sentDate = date.toISOString();

  it('verify details of expanded messages', () => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();

    PatientMessageDetailsPage.loadSingleThread();

    PatientMessageDetailsPage.verifyExpandedMessageTo(threadResponse);

    PatientMessageDetailsPage.verifyExpandedThreadBody(threadResponse);

    PatientMessageDetailsPage.expandAllThreadMessages();

    PatientMessageDetailsPage.verifyAccordionStatus(false);

    PatientMessageDetailsPage.expandAllThreadMessages();

    PatientMessageDetailsPage.verifyAccordionStatus(true);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
