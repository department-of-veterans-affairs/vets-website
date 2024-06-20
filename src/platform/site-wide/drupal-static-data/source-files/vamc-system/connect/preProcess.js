/**
 * Structure of vamcSystemData:
 *
 * {
 *  "data": {
 *    "systems": {
 *      "VAMC System name": {
 *        "vhaId": "Facility name",
 *      }
 *    }
 *  }
 * }
 * vhaId is used to lookup the facility in whatever other source it's needed (e.g. police data is id'ed by facility vhaId)
 */

export const preProcessSystemData = vamcSystemData => {
  return vamcSystemData;
};
