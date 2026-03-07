/* eslint-disable camelcase */

import {
  fetchAndUpdateSessionExpiration as fetch,
  apiRequest,
} from '@department-of-veterans-affairs/platform-utilities/api';
import { getApi, getEndpointOptions } from '../config';

class RepresentativeFinderApi {
  constructor(
    address = null,
    lat,
    long,
    name,
    page,
    perPage = 10,
    sort,
    type = 'veteran_service_officer',
    distance,
    organizationFilter,
  ) {
    this.address = address;
    this.lat = lat;
    this.long = long;
    this.name = name;
    this.page = page;
    this.perPage = perPage;
    this.sort = sort;
    this.type = type;
    this.distance = distance;
    this.organizationFilter = organizationFilter;
  }

  /**
   * @returns {Promise} Promise object
   */
  async searchByCoordinates() {
    const startTime = new Date().getTime();
    const { requestUrl, apiSettings } = this.buildUrl();
    const res = await fetch(requestUrl, apiSettings);
    if (!res.ok) {
      throw Error(res.statusText);
    }
    const asJson = await res.json();
    return {
      ...asJson,
      meta: {
        ...asJson.meta,
        resultTime: new Date().getTime() - startTime,
      },
    };
  }

  static async reportResult(newReport) {
    const startTime = new Date().getTime();

    const { flagReps } = getEndpointOptions();
    const { requestUrl, apiSettings } = getApi(flagReps, 'POST', newReport);

    const res = await apiRequest(requestUrl, apiSettings);
    if (res.error) {
      throw Error(res.error);
    }
    return {
      ...res,
      meta: {
        ...res.meta,
        resultTime: new Date().getTime() - startTime,
      },
    };
  }

  buildUrl() {
    const searchParams = new URLSearchParams();
    if (this.address) searchParams.set('address', this.address);
    if (this.lat) searchParams.set('lat', this.lat);
    if (this.long) searchParams.set('long', this.long);
    if (this.name) searchParams.set('name', this.name);
    searchParams.set('page', this.page);
    searchParams.set('per_page', this.perPage);
    searchParams.set('sort', this.sort);
    searchParams.set('type', this.type);
    if (this.distance) searchParams.set('distance', this.distance);
    if (this.organizationFilter)
      searchParams.set('org_name', this.organizationFilter);

    const { fetchVSOReps, fetchOtherReps } = getEndpointOptions();
    const endpoint =
      this.type === 'veteran_service_officer' ? fetchVSOReps : fetchOtherReps;
    const { requestUrl, apiSettings } = getApi(endpoint);

    return {
      requestUrl: `${requestUrl}?${searchParams}`,
      apiSettings,
    };
  }
}

export default RepresentativeFinderApi;
