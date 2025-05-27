/**
 *
 *
 * @export
 * @class MockTravelPayClaim
 */
export default class MockTravelPayClaim {
  /**
   * Creates an instance of MockTravelPayClaim.
   * @memberof MockTravelPayClaim
   */
  constructor() {
    this.metadata = {
      status: 200,
      message: 'No claims found.',
      success: true,
    };
  }
}
