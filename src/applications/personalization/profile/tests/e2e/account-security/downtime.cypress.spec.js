import moment from 'moment';

import { PROFILE_PATHS } from '../../../constants';

import userNon2Fa from '../../fixtures/users/user-non-2fa.json';
import fullName from '../../fixtures/full-name-success.json';
import personalInformation from '../../fixtures/personal-information-success-enhanced.json';
import serviceHistory from '../../fixtures/service-history-success.json';

const withinHour = moment()
  .add(1, 'hour')
  .subtract(1, 'minute')
  .toISOString();
const endTime = moment()
  .add(6, 'hour')
  .toISOString();

context('downtime notification cases for Account Security', () => {
  beforeEach(() => {
    cy.intercept('v0/profile/full_name', fullName);
    cy.intercept('v0/profile/personal_information', personalInformation);
    cy.intercept('v0/profile/service_history', () => serviceHistory);

    cy.login(userNon2Fa);
  });

  it('should show downtime approaching modal', () => {
    cy.intercept('GET', '/v0/maintenance_windows', {
      data: [
        {
          id: '139',
          type: 'maintenance_windows',
          attributes: {
            externalService: 'evss',
            description: 'My description',
            startTime: withinHour,
            endTime,
          },
        },
      ],
    });
    cy.visit(PROFILE_PATHS.ACCOUNT_SECURITY);

    cy.get('#downtime-approaching-modal').should('exist');

    cy.injectAxeThenAxeCheck();
  });
});
