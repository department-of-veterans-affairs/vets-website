/**
 * @module tests/fixtures/data
 * @description Test data fixtures for form testing
 *
 * Optimized test coverage (5 core fixtures):
 * - minimal-test: Veteran is claimant, SMC, not hospitalized (baseline)
 * - maximal-test: Spouse is claimant, SMP, hospitalized with APO military address (full complexity)
 * - parent-claimant-smp-hospitalized: Parent claimant, SMP, hospitalized (unique relationship)
 * - spouse-military-address: Spouse with FPO military address, SMC, not hospitalized (FPO coverage)
 * - child-with-suffixes: Child with name suffixes, SMP, hospitalized with DPO address (suffixes + DPO)
 *
 * Coverage maintained:
 * - All 4 relationships: veteran, spouse, child, parent
 * - Both benefit types: SMC, SMP
 * - Both hospitalization states: yes, no
 * - All military address types: APO, FPO, DPO
 * - Edge cases: suffixes, 3-line addresses, middle names
 */

// Primary test data (form input)
export { default as minimalTest } from './minimal-test.json';
export { default as maximalTest } from './maximal-test.json';
export {
  default as parentClaimantSMPHospitalized,
} from './parent-claimant-smp-hospitalized.json';
export {
  default as spouseMilitaryAddress,
} from './spouse-military-address.json';
export { default as childWithSuffixes } from './child-with-suffixes.json';

// Payload data (after submit transformer)
export { default as minimalPayload } from './minimal-payload.json';
export { default as maximalPayload } from './maximal-payload.json';
