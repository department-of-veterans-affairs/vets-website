import { getDate } from '../../shared/utils/dates';

export const getRandomDate = () =>
  getDate({
    offset: {
      months: -Math.floor(Math.random() * 6 + 1),
      days: -Math.floor(Math.random() * 10),
    },
  });

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
          expirationDate: getDate({ offset: { months: 3 }, pattern: null }),
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
  cy.get('.itf-inner')
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
