import manifest from '../../manifest.json';
import mockUser from './fixtures/mocks/mock-user';
import mockPrefill from './fixtures/mocks/mock-prefill.json';
import maxTestData from './fixtures/data/maximal-test.json';
import featureToggles from './fixtures/mocks/mock-features.json';
import { disableConfirmationOnLocal } from './helpers/disableConfirmationOnLocal';
import {
  fillTextWebComponent,
  goToNextPage,
  selectDropdownWebComponent,
  fillNameWithKeyboard,
  selectYesNoWebComponent,
} from './helpers';
import { MOCK_ENROLLMENT_RESPONSE, API_ENDPOINTS } from '../../utils/constants';
import { advanceToNextOfKin } from './helpers/next-of-kin';

const { data: testData } = maxTestData;

describe('EZR Next Of Kin flow', () => {
  beforeEach(() => {
    disableConfirmationOnLocal();

    cy.login(mockUser);
    cy.intercept('GET', '/v0/feature_toggles*', featureToggles).as(
      'mockFeatures',
    );
    cy.intercept('GET', `/v0${API_ENDPOINTS.enrollmentStatus}*`, {
      statusCode: 200,
      body: MOCK_ENROLLMENT_RESPONSE,
    }).as('mockEnrollmentStatus');
    cy.intercept('/v0/in_progress_forms/10-10EZR', {
      statusCode: 200,
      body: mockPrefill,
    }).as('mockSip');
  });

  it('should add next of kins', () => {
    cy.visit(manifest.rootUrl);
    cy.wait(['@mockUser', '@mockFeatures', '@mockEnrollmentStatus']);

    advanceToNextOfKin();

    selectYesNoWebComponent('view:hasNextOfKin', true);

    goToNextPage(
      '/update-benefits-information-form-10-10ezr/veteran-information/next-of-kin/0/contact',
    );

    const contact = testData.nextOfKins[0];
    // NoK 1 basic info
    fillNameWithKeyboard('fullName', contact.fullName);
    fillTextWebComponent('primaryPhone', contact.primaryPhone);
    selectDropdownWebComponent('relationship', contact.relationship);

    // NoK 1 address
    goToNextPage(
      '/update-benefits-information-form-10-10ezr/veteran-information/next-of-kin/0/contact-address',
    );
    cy.selectVaSelect(`root_address_country`, contact.address.country);
    fillTextWebComponent('address_street', contact.address.street);
    fillTextWebComponent('address_city', contact.address.city);
    selectDropdownWebComponent('address_state', contact.address.state);
    fillTextWebComponent('address_postalCode', contact.address.postalCode);

    cy.tabToElementAndPressSpace('.usa-button-primary');

    cy.findByText(/Review your next of kin/i).should('exist');
    cy.findByText(`${contact.fullName.first} ${contact.fullName.last}`).should(
      'exist',
    );
    cy.findByText(contact.primaryPhone).should('exist');

    cy.findByText(
      /You have added the maximum number of allowed next of kins/i,
    ).should('not.exist');
    cy.injectAxeThenAxeCheck();
  });
});
