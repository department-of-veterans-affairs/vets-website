import manifest from '../../manifest.json';
import maxTestData from './fixtures/data/maximal-test.json';
import mockEnrollmentStatus from './fixtures/mocks/enrollment-status.json';
import featureToggles from './fixtures/mocks/feature-toggles.tera.json';
import { goToNextPage } from './utils';

const { data: testData } = maxTestData;
const APIs = {
  features: '/v0/feature_toggles*',
  enrollment: '/v0/health_care_applications/enrollment_status*',
};

describe('HCA-TERA-Branching', () => {
  const setupGuestUser = () => {
    cy.intercept('GET', APIs.features, featureToggles).as('mockFeatures');
    cy.intercept('GET', APIs.enrollment, mockEnrollmentStatus).as(
      'mockEnrollmentStatus',
    );
    cy.visit(manifest.rootUrl);
    cy.wait(['@mockFeatures']);
  };
  const advanceToTERA = ({
    birthdate = testData.veteranDateOfBirth,
    entryDate = testData.lastEntryDate,
    dischargeDate = testData.lastDischargeDate,
  }) => {
    cy.get('.schemaform-start-button')
      .first()
      .click();
    cy.location('pathname').should('include', '/id-form');

    cy.get('#root_firstName').type(testData.veteranFullName.first);
    cy.get('#root_lastName').type(testData.veteranFullName.last);

    const [birthYear, birthMonth, birthDay] = birthdate
      .split('-')
      .map(dateComponent => parseInt(dateComponent, 10).toString());
    cy.get('#root_dobMonth').select(birthMonth);
    cy.get('#root_dobDay').select(birthDay);
    cy.get('#root_dobYear').type(birthYear);

    cy.get('#root_ssn').type(testData.veteranSocialSecurityNumber);

    goToNextPage('/check-your-personal-information');
    goToNextPage('/veteran-information/birth-information');
    goToNextPage('/veteran-information/maiden-name-information');
    goToNextPage('/veteran-information/birth-sex');
    cy.get('[name="root_gender"]').check('M');

    goToNextPage('/veteran-information/demographic-information');
    goToNextPage('/veteran-information/veteran-address');
    cy.get('#root_veteranAddress_street').type(testData.veteranAddress.street);
    cy.get('#root_veteranAddress_city').type(testData.veteranAddress.city);
    cy.get('#root_veteranAddress_state').select(testData.veteranAddress.state);
    cy.get('#root_veteranAddress_postalCode').type(
      testData.veteranAddress.postalCode,
    );
    cy.get('[name="root_view:doesMailingMatchHomeAddress"]').check('Y');

    goToNextPage('/veteran-information/contact-information');
    goToNextPage('/va-benefits/basic-information');
    cy.get('[name="root_vaCompensationType"]').check('none');

    goToNextPage('/va-benefits/pension-information');
    cy.get('[name="root_vaPensionType"]').check('No');

    goToNextPage('/military-service/service-information');
    cy.get('#root_lastServiceBranch').select(testData.lastServiceBranch);

    const [entryYear, entryMonth, entryDay] = entryDate
      .split('-')
      .map(dateComponent => parseInt(dateComponent, 10).toString());
    cy.get('#root_lastEntryDateMonth').select(entryMonth);
    cy.get('#root_lastEntryDateDay').select(entryDay);
    cy.get('#root_lastEntryDateYear').type(entryYear);

    const [dischargeYear, dischargeMonth, dischargeDay] = dischargeDate
      .split('-')
      .map(dateComponent => parseInt(dateComponent, 10).toString());
    cy.get('#root_lastDischargeDateMonth').select(dischargeMonth);
    cy.get('#root_lastDischargeDateDay').select(dischargeDay);
    cy.get('#root_lastDischargeDateYear').type(dischargeYear);
    cy.get('#root_dischargeType').select(testData.dischargeType);

    goToNextPage('/military-service/additional-information');
    goToNextPage('/military-service/toxic-exposure');
    cy.get('[name="root_hasTeraResponse"]').check('Y');
  };

  beforeEach(() => {
    setupGuestUser();
  });

  it('should render radiation cleanup and agent orange questions when Veteran birthdate is prior to 1966', () => {
    advanceToTERA({});
    goToNextPage('/military-service/radiation-cleanup-efforts');
    cy.get('[name="root_radiationCleanupEfforts"]').check('N');

    goToNextPage('/military-service/gulf-war-service');
    cy.get('[name="root_gulfWarService"]').check('N');

    goToNextPage('/military-service/operation-support');
    cy.get('[name="root_combatOperationService"]').check('N');

    goToNextPage('/military-service/agent-orange-exposure');
    cy.get('[name="root_exposedToAgentOrange"]').check('Y');

    goToNextPage('/military-service/other-toxic-exposure');
    goToNextPage('/military-service/documents');
    cy.injectAxeThenAxeCheck();
  });

  it('should not render radiation cleanup and agent orange questions when Veteran birthdate is after 1965', () => {
    advanceToTERA({ birthdate: '1970-01-01' });
    goToNextPage('/military-service/gulf-war-service');
    cy.get('[name="root_gulfWarService"]').check('N');

    goToNextPage('/military-service/operation-support');
    cy.get('[name="root_combatOperationService"]').check('Y');

    goToNextPage('/military-service/other-toxic-exposure');
    goToNextPage('/military-service/documents');
    cy.injectAxeThenAxeCheck();
  });

  it('should render post-9/11 question when Veteran birthdate is after Feb 2, 1976', () => {
    advanceToTERA({
      birthdate: '1987-01-01',
      entryDate: '2005-01-01',
      dischargeDate: '2010-01-01',
    });
    goToNextPage('/military-service/post-sept-11-service');
    cy.get('[name="root_gulfWarService"]').check('N');

    goToNextPage('/military-service/operation-support');
    cy.get('[name="root_combatOperationService"]').check('Y');

    goToNextPage('/military-service/other-toxic-exposure');
    goToNextPage('/military-service/documents');
    cy.injectAxeThenAxeCheck();
  });
});
