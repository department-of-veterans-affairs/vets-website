describe('Downtime Banners', () => {
  const apiUrl = 'v0/user/backend_statuses';
  const bannerSelector = '.form-warning-banner';

  beforeEach(() => {
    cy.intercept('GET', apiUrl, req => {
      req.reply({
        statusCode: 200,
        // eslint-disable-next-line camelcase
        body: { statuses: [], maintenance_windows: [] },
      });
    }).as('getBackendStatuses');
    cy.visit('/?next=loginModal');
  });

  it('displays downtime banner for bad API response', () => {
    cy.intercept('GET', apiUrl, {
      statusCode: 500,
      body: {},
    }).as('getBackendStatusesError');

    cy.reload();
    cy.wait('@getBackendStatusesError');
    cy.get(bannerSelector).within(() => {
      cy.contains(
        'You may have trouble signing in or using some tools or services',
      );
      cy.contains(
        'We’re sorry. We’re working to fix a problem that affects some parts of our site.',
      );
    });
  });

  it('displays an error in maintenance windows when dates are not formatted correctly', () => {
    cy.intercept('GET', apiUrl, {
      statusCode: 200,
      body: {
        // eslint-disable-next-line camelcase
        maintenance_windows: [
          {
            // eslint-disable-next-line camelcase
            start_time: 'malformed-date',
            // eslint-disable-next-line camelcase
            end_time: 'malformed-date',
            // eslint-disable-next-line camelcase
            external_service: 'global',
          },
        ],
      },
    }).as('getMalformedDates');

    cy.reload();
    cy.wait('@getMalformedDates');
    cy.get(bannerSelector).should('not.exist');
  });

  it('displays the maintenance banner when dates are properly formatted', () => {
    const now = new Date();
    const startTime = new Date(
      now.getTime() - 1 * 60 * 60 * 1000,
    ).toISOString(); // 1 hour ago
    const endTime = new Date(now.getTime() + 2 * 60 * 60 * 1000).toISOString(); // 2 hours from now

    cy.intercept('GET', apiUrl, {
      statusCode: 200,
      body: {
        // eslint-disable-next-line camelcase
        maintenance_windows: [
          {
            // eslint-disable-next-line camelcase
            start_time: startTime,
            // eslint-disable-next-line camelcase
            end_time: endTime,
            // eslint-disable-next-line camelcase
            external_service: 'global',
          },
        ],
      },
    }).as('getValidDates');

    cy.reload();
    cy.wait('@getValidDates');
    cy.get(bannerSelector).within(() => {
      cy.contains('Upcoming site maintenance');
      cy.contains('The maintenance will last about');
    });
  });
});
