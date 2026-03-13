import { expect } from 'chai';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import {
  getApi,
  getEndpointOptions,
  setRepSearchEndpointsFromFlag,
} from '../config';
import RepresentativeFinderApi from '../api/RepresentativeFinderApi';

describe('Locator url and parameters builder', () => {
  const address = '43210';
  const lat = '40.17887';
  const long = '-99.27246';
  const name = 'test';
  const page = 2;
  const perPage = 7;
  const sort = 'distance_asc';
  const type = 'veteran_service_officer';
  const distance = '100';
  const organization = 'American Legion';
  const organizationUrlEncoded = 'American+Legion';

  beforeEach(() => {
    setRepSearchEndpointsFromFlag(false);
  });

  it('should build VA request URL when there are valid params and type is veteran_service_officer', () => {
    const apiInstance = new RepresentativeFinderApi(
      address,
      lat,
      long,
      name,
      page,
      perPage,
      sort,
      type,
      distance,
      organization,
    );

    const { requestUrl } = apiInstance.buildUrl();
    expect(requestUrl).to.include(
      `${
        environment.API_URL
      }/services/veteran/v0/vso_accredited_representatives`,
    );
    expect(requestUrl).to.include(`address=${address}`);
    expect(requestUrl).to.include(`lat=${lat}`);
    expect(requestUrl).to.include(`long=${long}`);
    expect(requestUrl).to.include(`name=${name}`);
    expect(requestUrl).to.include(`page=${page}`);
    expect(requestUrl).to.include(`per_page=${perPage}`);
    expect(requestUrl).to.include(`sort=${sort}`);
    expect(requestUrl).to.include(`type=${type}`);
    expect(requestUrl).to.include(`distance=${distance}`);
    expect(requestUrl).to.include(`org_name=${organizationUrlEncoded}`);
  });

  it('should build VA request URL when there are valid params and type is attorney', () => {
    const typeAttorney = 'attorney';
    const apiInstance = new RepresentativeFinderApi(
      address,
      lat,
      long,
      name,
      page,
      perPage,
      sort,
      typeAttorney,
      distance,
      organization,
    );

    const { requestUrl } = apiInstance.buildUrl();
    expect(requestUrl).to.include(
      `${
        environment.API_URL
      }/services/veteran/v0/other_accredited_representatives`,
    );
    expect(requestUrl).to.include(`address=${address}`);
    expect(requestUrl).to.include(`lat=${lat}`);
    expect(requestUrl).to.include(`long=${long}`);
    expect(requestUrl).to.include(`name=${name}`);
    expect(requestUrl).to.include(`page=${page}`);
    expect(requestUrl).to.include(`per_page=${perPage}`);
    expect(requestUrl).to.include(`sort=${sort}`);
    expect(requestUrl).to.include(`type=${typeAttorney}`);
    expect(requestUrl).to.include(`distance=${distance}`);
    expect(requestUrl).to.include(`org_name=${organizationUrlEncoded}`);
  });
  it('should build VA request URL when there are valid params and type is claim_agents', () => {
    const typeClaimsAgent = 'claim_agents';
    const apiInstance = new RepresentativeFinderApi(
      address,
      lat,
      long,
      name,
      page,
      perPage,
      sort,
      typeClaimsAgent,
      distance,
      organization,
    );

    const { requestUrl } = apiInstance.buildUrl();
    expect(requestUrl).to.include(
      `${
        environment.API_URL
      }/services/veteran/v0/other_accredited_representatives`,
    );
    expect(requestUrl).to.include(`address=${address}`);
    expect(requestUrl).to.include(`lat=${lat}`);
    expect(requestUrl).to.include(`long=${long}`);
    expect(requestUrl).to.include(`name=${name}`);
    expect(requestUrl).to.include(`page=${page}`);
    expect(requestUrl).to.include(`per_page=${perPage}`);
    expect(requestUrl).to.include(`sort=${sort}`);
    expect(requestUrl).to.include(`type=${typeClaimsAgent}`);
    expect(requestUrl).to.include(`distance=${distance}`);
    expect(requestUrl).to.include(`org_name=${organizationUrlEncoded}`);
  });

  it('should set csrfToken in request headers', () => {
    localStorage.setItem('csrfToken', '12345');
    const { flagReps } = getEndpointOptions();
    const { apiSettings } = getApi(flagReps);
    expect(apiSettings?.headers?.['X-CSRF-Token']).to.eql('12345');
  });

  it('should exclude null params from request', () => {
    const apiInstance = new RepresentativeFinderApi(
      null,
      null,
      null,
      null,
      page,
      perPage,
      sort,
      type,
      distance,
      organization,
    );

    const { requestUrl } = apiInstance.buildUrl();
    expect(requestUrl).to.include(
      `${
        environment.API_URL
      }/services/veteran/v0/vso_accredited_representatives`,
    );
    expect(requestUrl).to.not.include('address');
    expect(requestUrl).to.not.include('lat');
    expect(requestUrl).to.not.include('long');
    expect(requestUrl).to.not.match(/(?<!org_)name/);
    expect(requestUrl).to.include(`page=${page}`);
    expect(requestUrl).to.include(`per_page=${perPage}`);
    expect(requestUrl).to.include(`sort=${sort}`);
    expect(requestUrl).to.include(`distance=${distance}`);
    expect(requestUrl).to.include(`org_name=${organizationUrlEncoded}`);
  });

  it('should encode special characters in request query string', () => {
    const complexAddress = '1 Test Parkway Apt #20, Chicago, Illinois, 60605';
    const complexAddressUrlEncoded =
      '1+Test+Parkway+Apt+%2320%2C+Chicago%2C+Illinois%2C+60605';
    const complexName = 'Test ?&=# Test';
    const complexNameUrlEncoded = 'Test+%3F%26%3D%23+Test';

    const apiInstance = new RepresentativeFinderApi(
      complexAddress,
      lat,
      long,
      complexName,
      page,
      perPage,
      sort,
      type,
      distance,
      organization,
    );

    const { requestUrl } = apiInstance.buildUrl();
    expect(requestUrl).to.include(
      `${
        environment.API_URL
      }/services/veteran/v0/vso_accredited_representatives`,
    );
    expect(requestUrl).to.include(`address=${complexAddressUrlEncoded}`);
    expect(requestUrl).to.include(`name=${complexNameUrlEncoded}`);
  });

  it('uses new accredited_individuals endpoints when flag is ON', () => {
    setRepSearchEndpointsFromFlag(true); // new endpoints
    const { fetchVSOReps, fetchOtherReps } = getEndpointOptions();
    expect(fetchVSOReps).to.equal(
      '/representation_management/v0/accredited_individuals',
    );
    expect(fetchOtherReps).to.equal(
      '/representation_management/v0/accredited_individuals',
    );
  });
});
