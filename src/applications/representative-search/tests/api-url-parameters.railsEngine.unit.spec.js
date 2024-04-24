import { expect } from 'chai';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import {
  resolveParamsWithUrl,
  getApi,
  endpointOptions,
  formatReportBody,
} from '../config';

describe('Locator url and parameters builder', () => {
  const address = '43210';
  const lat = '40.17887';
  const long = '-99.27246';
  const name = 'test';
  const sort = 'distance_asc';
  const distance = '100';

  it('should build VA request with type=veteran_service_officer', () => {
    const type = 'veteran_service_officer';

    const { requestUrl } = getApi(endpointOptions.fetchVSOReps);

    const params = resolveParamsWithUrl({
      address,
      lat,
      long,
      name,
      page: 1,
      perPage: 10,
      sort,
      type,
      distance,
    });

    const test = `${requestUrl}${params}`;
    expect(test).to.eql(
      `${
        environment.API_URL
      }/services/veteran/v0/vso_accredited_representatives?address=43210&lat=40.17887&long=-99.27246&name=test&page=1&per_page=10&sort=distance_asc&type=veteran_service_officer&distance=100`,
    );
  });

  it('should build VA request with type=claim_agents', () => {
    const type = 'claim_agents';

    const { requestUrl } = getApi(endpointOptions.fetchOtherReps);

    const params = resolveParamsWithUrl({
      address,
      lat,
      long,
      name,
      page: 1,
      perPage: 10,
      sort,
      type,
      distance,
    });

    const test = `${requestUrl}${params}`;
    expect(test).to.eql(
      `${
        environment.API_URL
      }/services/veteran/v0/other_accredited_representatives?address=43210&lat=40.17887&long=-99.27246&name=test&page=1&per_page=10&sort=distance_asc&type=claim_agents&distance=100`,
    );
  });

  it('should build VA request with type=attorney and page = 2 and perPage = 7', () => {
    const type = 'attorney';
    const { requestUrl } = getApi(endpointOptions.fetchOtherReps);

    const params = resolveParamsWithUrl({
      address,
      lat,
      long,
      name,
      page: 2,
      perPage: 7,
      sort,
      type,
      distance,
    });

    const test = `${requestUrl}${params}`;
    expect(test).to.eql(
      `${
        environment.API_URL
      }/services/veteran/v0/other_accredited_representatives?address=43210&lat=40.17887&long=-99.27246&name=test&page=2&per_page=7&sort=distance_asc&type=attorney&distance=100`,
    );
  });

  it('should set csrfToken in request headers', () => {
    localStorage.setItem('csrfToken', '12345');
    const { apiSettings } = getApi(endpointOptions.flagReps);
    expect(apiSettings?.headers?.['X-CSRF-Token']).to.eql('12345');
  });

  it('should format report object into snake case POST request body', () => {
    const reportObject = {
      representativeId: 123,
      reports: {
        phone: '644-465-8493',
        email: 'example@rep.com',
        address: '123 Any Street',
        other: 'other comment',
      },
    };

    const formattedReportBody = JSON.stringify(formatReportBody(reportObject));

    expect(formattedReportBody).to.eql(
      '{"representative_id":123,"flags":[{"flag_type":"phone_number","flagged_value":"644-465-8493"},{"flag_type":"email","flagged_value":"example@rep.com"},{"flag_type":"address","flagged_value":"123 Any Street"},{"flag_type":"other","flagged_value":"other comment"}]}',
    );
  });

  it('should exclude null params from request', () => {
    const { requestUrl } = getApi(endpointOptions.fetchOtherReps);

    const params = resolveParamsWithUrl({
      address: null,
      lat: null,
      long: null,
      name: null,
      page: 2,
      perPage: 7,
      sort,
      distance,
    });

    const test = `${requestUrl}${params}`;
    expect(test).to.eql(
      `${
        environment.API_URL
      }/services/veteran/v0/other_accredited_representatives?page=2&per_page=7&sort=distance_asc&type=veteran_service_officer&distance=100`,
    );
  });
});
