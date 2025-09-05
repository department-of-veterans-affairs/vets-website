import MedicationsSite from './med_site/MedicationsSite';
import rxList from './fixtures/listOfPrescriptions.json';
import mockUserMedsByMail from './fixtures/user-meds-by-mail.json';
import MedicationsListPage from './pages/MedicationsListPage';

describe('Medications List Page Meds by Mail content', () => {
  const titleNotesMessageChunk1 =
    'Bring your medications list to each appointment. And tell your provider about any new allergies or reactions.';
  const titleNotesMessageChunk2 =
    ' If you use Meds by Mail, you can also call your servicing center and ask them to update your records.';

  it('shows correct content for non-Meds by Mail users', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    site.login();
    listPage.visitMedicationsListPageURL(rxList);
    cy.contains(titleNotesMessageChunk1 + titleNotesMessageChunk2);
    cy.get('[data-testid="meds-by-mail-additional-info"]').should('not.exist');
    cy.injectAxe();
    cy.axeCheck('main');
  });

  it('shows correct content for Meds by Mail users', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    site.login(true, mockUserMedsByMail);
    listPage.visitMedicationsListPageURL(rxList);
    cy.contains(titleNotesMessageChunk1);
    cy.contains(
      'span',
      'How to update your allergies and reactions if you use Meds by Mail',
    ).click();

    cy.contains(
      'p',
      'We may not have your allergy records in our My HealtheVet tools. But the Meds by Mail servicing center keeps a record of your allergies and reactions to medications.',
    );

    cy.contains(
      'p',
      'If you have a new allergy or reaction, tell your provider. Or you can call us at',
    );

    const expectedPhoneNumbers = [
      { text: '866-229-7389', href: 'tel:+18662297389' },
      { text: '888-385-0235', href: 'tel:+18883850235' },
      { text: 'TTY: 711', href: 'tel:711', tty: true },
    ];

    expectedPhoneNumbers.forEach((phoneNumber, index) => {
      cy.get('[data-testid="meds-by-mail-additional-info"]').within(() => {
        cy.get('va-telephone')
          .eq(index)
          .shadow()
          .find('a')
          .should('contain.text', phoneNumber.text)
          .and('have.attr', 'href', phoneNumber.href);
      });
    });

    cy.contains(
      'p',
      'and ask us to update your records. We’re here Monday through Friday, 8:00 a.m. to 7:30 p.m. ET.',
    );

    cy.injectAxe();
    cy.axeCheck('main');
  });
});
