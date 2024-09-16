import manifest from '../../manifest.json';
import mockUser from './fixtures/mocks/mock-user';
import mockPrefill from './fixtures/mocks/mock-prefill.json';
import maxTestData from './fixtures/data/maximal-test.json';
import featureToggles from './fixtures/mocks/mock-features.json';
import { goToNextPage, selectYesNoWebComponent } from './helpers';
import {
  fillEmergencyContactAddress,
  fillEmergencyContactPersonalInfo,
  advanceToEmergencyContacts,
} from './helpers/emergency-contacts';
import { MOCK_ENROLLMENT_RESPONSE } from '../../utils/constants';

const { data: testData } = maxTestData;

describe('EZR Emergency Contacts flow', () => {
  beforeEach(() => {
    cy.login(mockUser);
    cy.intercept('GET', '/v0/feature_toggles*', featureToggles).as(
      'mockFeatures',
    );
    cy.intercept('GET', '/v0/health_care_applications/enrollment_status*', {
      statusCode: 200,
      body: MOCK_ENROLLMENT_RESPONSE,
    }).as('mockEnrollmentStatus');
    cy.intercept('/v0/in_progress_forms/10-10EZR', {
      statusCode: 200,
      body: mockPrefill,
    }).as('mockSip');
  });

  it('should add emergency contacts', () => {
    cy.visit(manifest.rootUrl);
    cy.wait(['@mockUser', '@mockFeatures', '@mockEnrollmentStatus']);

    advanceToEmergencyContacts();

    selectYesNoWebComponent('view:hasEmergencyContacts', true);
    goToNextPage(
      '/update-benefits-information-form-10-10ezr/emergency-contacts/0/contact',
    );

    let contact = testData.veteranContacts[0];
    // ec 1 basic info
    fillEmergencyContactPersonalInfo(contact);

    // ec 1 address
    goToNextPage(
      '/update-benefits-information-form-10-10ezr/emergency-contacts/0/contact-address',
    );
    fillEmergencyContactAddress(contact);

    cy.findByText(/Review your emergency contacts/i).should('exist');
    cy.findByText(`${contact.fullName.first} ${contact.fullName.last}`).should(
      'exist',
    );
    cy.findByText(contact.primaryPhone).should('exist');

    selectYesNoWebComponent('view:hasEmergencyContacts', true);
    cy.tabToElementAndPressSpace('.usa-button-primary');

    contact = testData.veteranContacts[1];
    // ec 2 basic info
    fillEmergencyContactPersonalInfo(contact);

    // ec 2 address
    goToNextPage(
      '/update-benefits-information-form-10-10ezr/emergency-contacts/1/contact-address',
    );
    fillEmergencyContactAddress(contact);

    // review page
    cy.get('va-alert').should(
      'include.text',
      'You have added the maximum number of allowed emergency contacts',
    );
  });
});
