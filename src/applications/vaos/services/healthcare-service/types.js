/**
 * @summary
 *
 * The equivalent of a VistA clinic
 *
 * @typedef {Object} HealthCareService
 *
 * @property {string} id The id of the service, in <vista site id>_<clinic id> format
 * @property {string} stationId The physical VA facility ID where this clinic is located
 * @property {string} stationName The name of the VA facility where this clinic is located
 * @property {string} serviceName The name of the clinic. Uses friendly name first, then falls back to
 *   the VistA name
 */
