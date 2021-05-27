/**
 * @typedef {Object} Characteristic
 *
 * @property {string} text The type of characteristic
 * @property {Object} coding
 * @property {string} coding.display The value of the characteristic
 */

/**
 * @typedef {Object} Identifier
 *
 * @property {string} system The type of identifier
 * @property {string} value The value of the identifier
 */

/**
 * @summary
 *
 * The equivalent of a VistA clinic
 *
 * @typedef {Object} HealthCareService
 *
 * @property {string} id The id of the service, in <vista site id>_<clinic id> format
 * @property {Array<Identifier>} identifier Contains one identifier, which contains a
 *   urn with the site code, facility id, and clinic id
 * @property {string} providedBy The VistA site for the clinic, in Organization/<vista site id>
 *   format
 * @property {Array<Object>} serviceType The first item contains a coded value for the type of care
 *   of this clinic (serviceType[0].type.coding.code)
 * @property {Object} location The actual facility of the vista clinic (found in the reference property)
 * @property {string} location.reference Facility id for the clinic, in Location/<facility id> format
 * @property {string} serviceName The name of the clinic. Uses friendly name first, then falls back to
 *   the VistA name
 * @property {Array<Characteristic>} characteristics A list of chararacteristics of the VistA clinic
 *   - First item is the direct scheduling flag
 *   - Second item is the display to patient flag (always true)
 *   - Third item is the institution code, which is the facility id
 *   - Fourth item is the institution name, which is the facility name
 *   - Fifth item is the clinic friendly name
 */
