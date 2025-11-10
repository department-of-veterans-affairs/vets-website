/**
 * @module tests/fixtures/data
 * @description Test data fixtures for form testing
 *
 * Streamlined test coverage (4 core fixtures):
 * - minimal-test: Veteran is claimant, SMC, not hospitalized (baseline)
 * - maximal-test: Spouse claimant, SMP, hospitalized (full complexity with middle names)
 * - parent-claimant-smp-hospitalized: Parent claimant, SMP, hospitalized (parent relationship)
 * - child-claimant-smc: Child claimant, SMC, not hospitalized (child relationship)
 *
 * Coverage maintained:
 * - All 4 relationships: veteran, spouse, child, parent
 * - Both benefit types: SMC, SMP
 * - Both hospitalization states: yes, no
 * - Edge cases: 3-line addresses, middle names, empty middle names
 */

// Primary test data (form input)
export { default as minimalTest } from './minimal-test.json';
export { default as maximalTest } from './maximal-test.json';
export {
  default as parentClaimantSMPHospitalized,
} from './parent-claimant-smp-hospitalized.json';
export { default as childClaimantSMC } from './child-claimant-smc.json';

// Payload data (after submit transformer)
export { default as minimalPayload } from './minimal-payload.json';
export { default as maximalPayload } from './maximal-payload.json';
