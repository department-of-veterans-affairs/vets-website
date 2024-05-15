import { addMonths, formatISO } from 'date-fns';

export const fetchItf = () => ({
  data: {
    id: '',
    type: 'evss_intent_to_file_intent_to_files_responses',
    attributes: {
      intentToFile: [
        {
          id: '1',
          creationDate: '2022-07-28T19:53:45.810+00:00',
          // pattern null = ISO8601 format
          expirationDate: formatISO(addMonths(new Date(), 3)),
          participantId: 1,
          source: 'EBN',
          status: 'active',
          type: 'compensation',
        },
      ],
    },
  },
});

export const getPastItf = cy => {
  cy.get('va-alert')
    .should('be.visible')
    .then(() => {
      // Click past the ITF message
      cy.get('va-button-pair')
        .shadow()
        .find('va-button[continue]')
        .shadow()
        .find('button')
        .click();
    });
};
