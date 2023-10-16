/**
 * Mock user class.
 *
 * @export
 * @class MockUser
 */
export class MockUser {
  /**
   * Creates an instance of MockUser.
   * @param {Object} props - Properties used to determine what type of mock user to create.
   * @param {Array} props.facilities - Set user registered facilities.
   * @param {string} [props.addressLine1 = '345 Home Address St'] - Set user home address
   * @param {String} [props.id = '1'] - Set user id.
   * @memberof MockUser
   */
  constructor({
    facilities,
    addressLine1 = '345 Home Address St',
    id = '1',
  } = {}) {
    this.data = {
      id: id.toString(),
      type: 'MockUser',
      attributes: {
        id,
        profile: {
          email: 'vets.gov.user+228@gmail.com',
          firstName: 'MARK',
          lastName: 'WEBB',
          loa: {
            current: 3,
            highest: 3,
          },
        },
        vaProfile: {
          facilities: facilities || [
            {
              facilityId: '983',
              isCerner: false,
            },
          ],
        },
        vet360ContactInformation: {
          residentialAddress: {
            addressLine1,
          },
        },
      },
      meta: { errors: null },
    };
  }
}
