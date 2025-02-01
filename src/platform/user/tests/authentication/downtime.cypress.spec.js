/*
describe('Maintenance Banner', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('handles API error response gracefully', () => {
    cy.window().then(win => {
      win.maintenanceWindows = {
        statusCode: 500,
        errors: ['API Error'],
      };
    });
    cy.get('va-alert').should('not.exist');
  });

  it('handles malformed maintenance dates correctly', () => {
    cy.window().then(win => {
      win.maintenanceWindows = [
        {
          external_service: 'global',
          start_time: 'invalid-date',
          end_time: 'invalid-date',
        },
      ];
    });
    cy.get('va-alert').should('not.exist');
  });
});
*/

describe('Maintenance Banner', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('displays maintenance banner with valid dates', () => {
    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + 2 * 60 * 60 * 1000);

    cy.intercept('GET', '**/v0/backend_statuses', req => {
      req.headers.Authorization = 'Bearer test-token';
      req.reply({
        data: {
          attributes: {
            reportedAt: '2024-03-21T16:54:34.000Z',
            statuses: [],
            maintenanceWindows: [
              {
                externalService: 'global',
                startTime: startTime.toISOString(),
                endTime: endTime.toISOString(),
              },
            ],
          },
        },
      });
    }).as('getBackendStatus');

    cy.wait('@getBackendStatus');
    cy.get('va-alert').should('be.visible');
  });
});
