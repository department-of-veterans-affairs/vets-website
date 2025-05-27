import { VIDEO_TYPES } from '../../utils/constants';

/**
 *
 *
 * @export
 * @class MockVideo
 */
export default class MockVideo {
  /**
   * Creates an instance of MockVideo.
   * @memberof MockVideo
   */
  constructor() {
    this.isVideo = true;
    this.facilityId = '983';
    this.kind = VIDEO_TYPES.clinic;
    this.extension = {
      patientHasMobileGfe: true,
    };
    this.providers = [
      {
        name: {
          firstName: ['TEST'],
          lastName: 'PROV',
        },
        display: 'TEST PROV',
      },
    ];
  }

  setKind(value) {
    this.kind = value;
    return this;
  }
}
