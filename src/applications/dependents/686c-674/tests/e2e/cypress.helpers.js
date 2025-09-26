import { getUnixTime, add } from 'date-fns';

import mockVaFileNumber from './fixtures/va-file-number.json';
import mockUser from './user.json';

export const setupCypress = (returnUrl = '') => {
  const submission = {
    formSubmissionId: '123fake-submission-id-567',
    timestamp: '2020-11-12',
    attributes: {
      guid: '123fake-submission-id-567',
    },
  };

  const twoMonthsAgo = getUnixTime(add(new Date(), { months: -2 }));

  const sipData = {
    form: '686C-674-V2',
    metadata: {
      version: 1,
      returnUrl,
      savedAt: new Date().getTime(),
      submission: {
        status: false,
        errorMessage: false,
        id: false,
        timestamp: false,
        hasAttemptedSubmit: false,
      },
      createdAt: twoMonthsAgo,
      expiresAt: getUnixTime(add(new Date(), { years: 1 })),
      lastUpdated: twoMonthsAgo,
      inProgressFormId: 1234,
    },
    lastUpdated: twoMonthsAgo,
  };

  const userData = returnUrl
    ? {
        data: {
          ...mockUser.data,
          attributes: {
            ...mockUser.data.attributes,
            inProgressForms: [sipData],
          },
        },
      }
    : mockUser;

  cy.intercept('GET', '/v0/user', userData);
  cy.intercept('GET', '/v0/feature_toggles?*', {
    data: {
      type: 'feature_toggles',
      features: [
        { name: 'vaDependentsV2', value: true },
        { name: 'va_dependents_v2', value: true },
        { name: 'vaDependentsNetWorthAndPension', value: true },
        { name: 'va_dependents_net_worth_and_pension', value: true },
        { name: 'vaDependentsDuplicateModals', value: true },
        { name: 'va_dependents_duplicate_modals', value: true },
      ],
    },
  });
  cy.intercept('GET', '/v0/maintenance_windows*', 'OK');
  cy.intercept('GET', '/v0/maintenance_windows', { data: [] });
  cy.intercept('POST', '/v0/claim_attachments', {
    data: { attributes: { confirmationCode: '5' } },
  });
  cy.intercept('GET', '/v0/profile/valid_va_file_number', mockVaFileNumber).as(
    'mockVaFileNumber',
  );
  cy.get('@testData').then(testData => {
    const mockSipGet = {
      formData: testData,
      metadata: {
        version: 0,
        prefill: true,
        returnUrl,
      },
    };

    const mockSipPut = {
      data: {
        id: '1234',
        type: 'in_progress_forms',
        attributes: {
          formId: '686C-674-V2',
          createdAt: '2021-06-03T00:00:00.000Z',
          updatedAt: '2021-06-03T00:00:00.000Z',
          metadata: {
            version: 1,
            returnUrl,
            savedAt: 1593500000000,
            lastUpdated: 1593500000000,
            expiresAt: 99999999999,
          },
        },
      },
    };

    cy.intercept('GET', '/v0/in_progress_forms/686C-674-V2', mockSipGet);
    cy.intercept('PUT', '/v0/in_progress_forms/686C-674-V2', mockSipPut);
    cy.intercept('POST', '/v0/dependents_applications', submission).as(
      'submitApplication',
    );

    cy.login(userData);
  });
};
