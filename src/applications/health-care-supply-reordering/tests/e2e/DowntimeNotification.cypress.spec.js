import { addMinutes } from 'date-fns';
import { appName, rootUrl } from '../../manifest.json';
import ipfMdotGetMock from '../data/noTempAddress.json';
import userMock from '../data/users/markUserData.json';

const ipfMdotPutMock = {
  data: {
    id: '12345',
    type: 'in_progress_forms',
    attributes: {
      formId: 'MDOT',
      createdAt: '2020-06-30T00:00:00.000Z',
      updatedAt: '2020-06-30T00:00:00.000Z',
      metadata: {},
    },
  },
};

const mdotSuppliesPostMock = [
  {
    status: 'Order Processed',
    orderId: '12345',
    productId: '9999',
  },
];

const maintenanceWindowsMock = (startTime, durationInMinutes) => ({
  data: [
    {
      id: '110',
      type: 'maintenance_window',
      attributes: {
        id: 110,
        externalService: 'mdot',
        startTime: startTime.toISOString(),
        endTime: addMinutes(startTime, durationInMinutes).toISOString(),
        description: '',
      },
    },
  ],
});

describe(`${appName} -- DowntimeNotification`, () => {
  before(() => {
    cy.intercept('GET', '/v0/feature_toggles*', { data: { features: [] } });
    cy.intercept('GET', '/v0/in_progress_forms/MDOT', ipfMdotGetMock);
    cy.intercept('PUT', '/v0/in_progress_forms/MDOT', ipfMdotPutMock);
    cy.intercept('POST', '/v0/mdot/supplies', mdotSuppliesPostMock);
    cy.intercept('GET', '/v0/user', userMock);
  });

  it('displays notification when down', () => {
    const startTime = addMinutes(new Date(), -1);
    cy.intercept(
      'GET',
      '/v0/maintenance_windows',
      maintenanceWindowsMock(startTime, 15),
    );
    cy.viewportPreset('va-top-mobile-1');
    cy.login(userMock);
    cy.visit(rootUrl);
    cy.findByText(/This application is down for maintenance/i);
    cy.injectAxeThenAxeCheck();
  });
});
