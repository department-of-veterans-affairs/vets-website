/**
 * @module tests/fixtures/data
 * @description Test data fixtures for form testing
 *
 * Complete test coverage (5 fixtures):
 * 1. minimal: Veteran is claimant, SMC, not hospitalized (baseline/simplest path - REQUIRED FIELDS ONLY)
 * 2. maximal: Spouse claimant, SMP, hospitalized (most complex with all optional fields)
 * 3. veteran-smp-hospitalized: Veteran is claimant, SMP, hospitalized (veteran + hospitalization edge case)
 * 4. child-claimant-smc: Child claimant, SMC, not hospitalized (child relationship)
 * 5. parent-claimant-smp-hospitalized: Parent claimant, SMP, hospitalized (parent relationship)
 *
 * Coverage Matrix:
 * ┌───────────┬──────────┬─────────┬──────────────┐
 * │ Fixture   │ Relation │ Benefit │ Hospitalized │
 * ├───────────┼──────────┼─────────┼──────────────┤
 * │ minimal   │ Veteran  │ SMC     │ No           │
 * │ maximal   │ Spouse   │ SMP     │ Yes          │
 * │ veteran-h │ Veteran  │ SMP     │ Yes          │
 * │ child     │ Child    │ SMC     │ No           │
 * │ parent    │ Parent   │ SMP     │ Yes          │
 * └───────────┴──────────┴─────────┴──────────────┘
 *
 * Coverage validation:
 * ✓ All 4 relationships: veteran, spouse, child, parent
 * ✓ Both benefit types: SMC, SMP
 * ✓ Both hospitalization states: yes, no
 * ✓ Edge cases: empty middle names, single char middle names, max length addresses
 * ✓ Veteran as claimant with hospitalization (critical edge case)
 */

// Test data fixtures (form input format)
export { default as minimal } from './minimal.json';
export { default as maximal } from './maximal.json';
export {
  default as veteranSMPHospitalized,
} from './veteran-smp-hospitalized.json';
export { default as childClaimantSMC } from './child-claimant-smc.json';
export {
  default as parentClaimantSMPHospitalized,
} from './parent-claimant-smp-hospitalized.json';
