/**
 * @module tests/fixtures/data
 * @description Test data fixtures for VA Form 21P-530A Interment Allowance
 *
 * Complete form coverage with 2 minimal fixtures (100% path coverage):
 *
 * MINIMAL FIXTURE:
 * - Organization: State cemetery
 * - Veteran: First/last name only (no middle)
 * - Identification: SSN only (no VA file number)
 * - Service periods: 0 (answered No to "any Veteran service periods to add?")
 * - Previous names: 0 (answered No to "served under another name")
 * - Optional fields: None (no middle name, no street2, no remarks)
 *
 * MAXIMAL FIXTURE:
 * - Organization: Tribal organization
 * - Veteran: First/middle/last name
 * - Identification: Both SSN and VA file number
 * - Service periods: 2 (multiple periods with different branches)
 * - Previous names: 2 (with mixed middle name patterns)
 * - Optional fields: All (middle names, street2, remarks)
 *
 * Complete Coverage Matrix:
 * ✅ Organization types: stateCemetery, tribalOrganization
 * ✅ Veteran ID: SSN only, SSN + VA file number
 * ✅ Name patterns: no middle name, with middle name
 * ✅ Service periods array: 0 items (optional), 2+ periods (multiple)
 * ✅ Previous names array: 0 items (none), 2+ items (multiple)
 * ✅ Optional fields: address street2, remarks, middle names
 * ✅ All required fields: organization info, veteran info, burial info
 *
 * Form Flow Paths Tested:
 * - Path 1 (minimal): Fastest completion, all required fields, no optional arrays
 * - Path 2 (maximal): Complete flow with all features, multiple array items
 *
 * Data Theme: Star Wars lore-accurate (fixtures only, not code/docs)
 */

// Primary test data (form input)
export { default as minimal } from './minimal.json';
export { default as maximal } from './maximal.json';
