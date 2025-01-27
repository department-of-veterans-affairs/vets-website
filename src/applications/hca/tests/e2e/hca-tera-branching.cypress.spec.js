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
    cy.selectRadio('root_radiationCleanupEfforts', 'N');

    goToNextPage('/military-service/gulf-war-service');
    cy.selectRadio('root_gulfWarService', 'N');

    goToNextPage('/military-service/operation-support');
    cy.selectRadio('root_combatOperationService', 'N');

    goToNextPage('/military-service/agent-orange-exposure');
    cy.selectRadio('root_exposedToAgentOrange', 'Y');

    goToNextPage('/military-service/other-toxic-exposure');
    goToNextPage('/military-service/documents');
    cy.injectAxeThenAxeCheck();
  });

  it('should not render radiation cleanup and agent orange questions when Veteran birthdate is after 1965', () => {
    advanceToTERA(testData, { birthdate: '1970-01-01' });

    goToNextPage('/military-service/gulf-war-service');
    cy.selectRadio('root_gulfWarService', 'N');

    goToNextPage('/military-service/operation-support');
    cy.selectRadio('root_combatOperationService', 'Y');

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
    cy.selectRadio('root_gulfWarService', 'N');

    goToNextPage('/military-service/operation-support');
    cy.selectRadio('root_combatOperationService', 'Y');

    goToNextPage('/military-service/other-toxic-exposure');
    goToNextPage('/military-service/documents');
    cy.injectAxeThenAxeCheck();
  });
});
