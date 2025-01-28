import maxTestData from './fixtures/data/maximal-test.json';
import mockFeatures from './fixtures/mocks/feature-toggles.tera.json';
import { advanceToTERA, goToNextPage, setupForGuest } from './utils';

const { data: testData } = maxTestData;

describe('HCA-TERA-Branching', () => {
  beforeEach(() => {
    setupForGuest({ features: mockFeatures });
  });

  it('should render radiation cleanup and agent orange questions when Veteran birthdate is prior to 1966', () => {
    advanceToTERA(testData);

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
    advanceToTERA(testData, { birthdate: '1970-01-01' });

    goToNextPage('/military-service/gulf-war-service');
    cy.get('[name="root_gulfWarService"]').check('N');

    goToNextPage('/military-service/operation-support');
    cy.get('[name="root_combatOperationService"]').check('Y');

    goToNextPage('/military-service/other-toxic-exposure');
    goToNextPage('/military-service/documents');
    cy.injectAxeThenAxeCheck();
  });

  it('should render post-9/11 question when Veteran birthdate is after Feb 2, 1976', () => {
    advanceToTERA(testData, {
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
