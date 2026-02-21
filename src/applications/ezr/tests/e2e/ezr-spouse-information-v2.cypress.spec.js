import { disableConfirmationOnLocal } from 'applications/ezr/tests/e2e/helpers/disableConfirmationOnLocal';
import manifest from '../../manifest.json';
import mockUser from './fixtures/mocks/mock-user.json';
import mockBasicPrefill from './fixtures/mocks/mock-prefill.json';
import mockPrefillWithNonPrefillData from './fixtures/mocks/mock-prefill-with-v2-prefill-data.json';
import maxTestData from './fixtures/data/maximal-test.json';
import featureToggles from './fixtures/mocks/mock-features.json';
import {
  goToNextPage,
  selectYesNoWebComponent,
  normalizeFeatureFlags,
} from './helpers';
import { MOCK_ENROLLMENT_RESPONSE } from '../../utils/constants';
import {
  advanceToHouseholdSection,
  fillSpouseContactInformation,
  fillSpousePersonalInformation,
} from './helpers/household';

import { handleOptionalServiceHistoryPage } from './helpers/handleOptionalServiceHistoryPage';

const { data: testData } = maxTestData;

featureToggles.data.features.push({
  name: 'ezrSpouseConfirmationFlowEnabled',
  value: true,
});

const featureFlagObject = normalizeFeatureFlags(featureToggles.data.features);

function setUserDataAndAdvanceToSpouseSection(user, prefillData) {
  cy.login(user);
  cy.intercept('GET', '/v0/feature_toggles*', featureToggles).as(
    'mockFeatures',
  );
  cy.intercept('GET', '/v0/health_care_applications/enrollment_status*', {
    statusCode: 200,
    body: MOCK_ENROLLMENT_RESPONSE,
  }).as('mockEnrollmentStatus');
  cy.intercept('/v0/in_progress_forms/10-10EZR', {
    statusCode: 200,
    body: prefillData,
  }).as('mockSip');
  cy.visit(manifest.rootUrl);
  cy.wait(['@mockUser', '@mockFeatures', '@mockEnrollmentStatus']);
  advanceToHouseholdSection();
  const hasServiceHistoryInfo =
    prefillData?.formData?.['view:hasPrefillServiceHistory'];

  handleOptionalServiceHistoryPage({
    historyEnabled: featureFlagObject.ezrServiceHistoryEnabled,
    hasServiceHistoryInfo,
    fillServiceHistory: true,
  });
  goToNextPage('/household-information/marital-status-information');
  cy.injectAxeThenAxeCheck();
}

describe('EZR V2 spouse information flow', () => {
  beforeEach(() => {
    setUserDataAndAdvanceToSpouseSection(mockUser, mockBasicPrefill);
    disableConfirmationOnLocal();
  });

  context('when the Veteran is married or separated', () => {
    it('should successfully fill the marital information', () => {
      cy.selectVaSelect('root_view:maritalStatus_maritalStatus', 'Married');
      goToNextPage('/household-information/spouse-information');
      goToNextPage(
        'household-information/spouse-information/0/personal-information',
      );

      fillSpousePersonalInformation();
      cy.injectAxeThenAxeCheck();
      goToNextPage(
        'household-information/spouse-information/0/additional-information',
      );

      cy.selectYesNoVaRadioOption(
        'root_cohabitedLastYear',
        testData.cohabitedLastYear,
      );
      cy.selectYesNoVaRadioOption('root_sameAddress', testData.sameAddress);
      cy.injectAxeThenAxeCheck();
      goToNextPage(
        'household-information/spouse-information/0/financial-support',
      );

      cy.selectYesNoVaRadioOption(
        'root_provideSupportLastYear',
        testData?.provideSupportLastYear,
      );
      cy.injectAxeThenAxeCheck();
      goToNextPage(
        'household-information/spouse-information/0/contact-information',
      );

      fillSpouseContactInformation(testData['view:spouseContactInformation']);
      cy.injectAxeThenAxeCheck();
      goToNextPage('household-information/spouse-information');

      cy.get('h3').should('contain', 'Review your spouse');
      cy.injectAxeThenAxeCheck();
    });
  });

  context('when the Veteran is not married or separated', () => {
    it('should skip the spouse information page', () => {
      cy.selectVaSelect(
        'root_view:maritalStatus_maritalStatus',
        'Never Married',
      );
      goToNextPage('household-information/dependents');
      cy.injectAxeThenAxeCheck();
    });
  });

  context('when there is prefilled spouse data', () => {
    beforeEach(() => {
      setUserDataAndAdvanceToSpouseSection(
        mockUser,
        mockPrefillWithNonPrefillData,
      );
      disableConfirmationOnLocal();
    });

    it('should edit the existing spouse information', () => {
      cy.get('va-select[name="root_view:maritalStatus_maritalStatus"]')
        .shadow()
        .find('select')
        .should('have.value', 'Married');
      goToNextPage('household-information/spouse-information');
      goToNextPage('household-information/spouse-information-summary');

      cy.findAllByRole('button', {
        name: /delete/i,
      }).should('not.exist');

      cy.get('va-link[text="Edit"]').click();

      cy.get('input[name="root_spouseFullName_first"]').should(
        'have.value',
        mockPrefillWithNonPrefillData.formData.spouseFullName.first,
      );
      fillSpousePersonalInformation({ firstName: 'Joe', lastName: 'Schmoe' });
      cy.injectAxeThenAxeCheck();
      cy.get('va-button[text="Save and continue"]').click();

      selectYesNoWebComponent('cohabitedLastYear', true);
      selectYesNoWebComponent('sameAddress', true);
      cy.get('va-button[text="Save and continue"]').click();

      cy.get('va-card[name="spouse_0"]').should('contain.text', 'Joe Schmoe');
    });
  });
});
