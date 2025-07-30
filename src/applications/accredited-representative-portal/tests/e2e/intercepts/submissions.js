export const setSubmissions = () => {
  cy.intercept('/accredited_representative_portal/v0/claim_submissions**', {
    data: [
      {
        submittedDate: '2025-04-09',
        firstName: 'John',
        lastName: 'Snyder',
        formType: '21-686c',
        packet: true,
        confirmationNumber: 'e3bd5925-6902-4b94-acbc-49b554ffcec1',
        vbmsStatus: 'awaiting_receipt',
        vbmsReceivedDate: '2025-04-19',
        url: null,
      },
      {
        submittedDate: '2025-04-09',
        firstName: 'Montgomery',
        lastName: 'Anderson',
        formType: '21-686c',
        packet: false,
        confirmationNumber: '58d1c6a3-f970-48cb-bc92-65403e2a0c16',
        vbmsStatus: 'received',
        vbmsReceivedDate: '2025-04-15',
        url: null,
      },
      {
        submittedDate: '2025-04-09',
        firstName: 'Isias',
        lastName: 'Fahey',
        formType: '21-686c',
        packet: false,
        confirmationNumber: 'f344d484-8b4b-4e81-93dc-5f6b6ef52bac',
        vbmsStatus: 'processing_error',
        vbmsReceivedDate: '2025-04-15',
        url: null,
      },
    ],
    meta: {
      page: {
        number: 1,
        size: 20,
        total: 45,
        totalPages: 3,
      },
    },
  });
};

export const setEmptySubmissions = () => {
  cy.intercept('/accredited_representative_portal/v0/submissions**', {
    data: [],
    meta: {
      page: {
        number: 1,
        size: 20,
        total: 0,
        totalPages: 1,
      },
    },
  });
};
