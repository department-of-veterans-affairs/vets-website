import Sinon from 'sinon';
import {
  mockFetch,
  setFetchJSONResponse,
} from '@department-of-veterans-affairs/platform-testing/helpers';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { getCommunityCareFacilities, getCommunityCareFacility } from '..';
import { calculateBoundingBox } from '../../../utils/address';

describe('VAOS Services: CC facilities API', () => {
  beforeEach(() => {});

  const data = [
    {
      id: 1,
      type: ',provider',
      attributes: {},
    },
  ];

  it('should get community care facility', async () => {
    // Arrange
    const id = 1;

    mockFetch();
    setFetchJSONResponse(global.fetch, { data });

    // Act
    await getCommunityCareFacility(id);

    // Assert
    Sinon.assert.calledOnce(global.fetch);
    Sinon.assert.calledWith(
      global.fetch,
      `${environment.API_URL}/v1/facilities/ccp/${id}`,
    );
  });

  it('should get community care facilities', async () => {
    // Arrange
    const radius = 60;
    const latitude = 10;
    const longitude = 10;
    const bbox = calculateBoundingBox(latitude, longitude, radius);
    const specialties = ['133NN1002X'];
    const bboxQuery = bbox.map(c => `bbox[]=${c}`).join('&');
    const specialtiesQuery = specialties
      .map(s => `specialties[]=${s}`)
      .join('&');

    mockFetch();
    setFetchJSONResponse(global.fetch, { data });

    // Act
    await getCommunityCareFacilities({
      bbox,
      latitude,
      longitude,
      radius,
      specialties,
    });

    // Assert
    Sinon.assert.calledOnce(global.fetch);
    Sinon.assert.calledWith(
      global.fetch,
      `${
        environment.API_URL
      }/facilities_api/v1/ccp/provider?latitude=${latitude}&longitude=${longitude}&radius=${radius}&per_page=${10}&page=${1}&${bboxQuery}&${specialtiesQuery}&trim=true`,
    );
  });
});
