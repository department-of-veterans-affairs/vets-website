import { expect } from 'chai';
import sinon from 'sinon';
import { renderHook } from '@testing-library/react-hooks';
import RepresentativeStatusApi from '../api/RepresentativeStatusApi';
import { useRepresentativeStatus } from '../hooks/useRepresentativeStatus';
import * as utilities from '../utilities/formatContactInfo';

describe('Hook', () => {
  let stub;
  let stubFormat;

  beforeEach(() => {
    stub = sinon
      .stub(RepresentativeStatusApi, 'getRepresentativeStatus')
      .resolves({
        data: {
          id: '074',
          type: 'veteran_service_organizations',
          attributes: {
            addressLine1: '1608 K St NW',
            addressLine2: null,
            addressLine3: null,
            addressType: 'Domestic',
            city: 'Washington',
            countryName: 'United States',
            countryCodeIso3: 'USA',
            province: 'District Of Columbia',
            internationalPostalCode: null,
            stateCode: 'DC',
            zipCode: '20006',
            zipSuffix: '2801',
            phone: '202-861-2700',
            type: 'organization',
            name: 'American Legion',
          },
        },
      });

    stubFormat = sinon.stub(utilities, 'formatContactInfo').returns({
      concatAddress: '1608 K St NW, Washington, DC, 20006',
      contact: '202-861-2700',
      extension: '2801',
      vcfUrl: 'http://example.com/contact.vcf',
    });
  });

  afterEach(() => {
    stub.restore();
    stubFormat.restore();
  });

  it('should start with isLoading true and null for error and representative', async () => {
    const { result } = renderHook(() => useRepresentativeStatus());
    expect(result.current.isLoading).to.be.true;
    expect(result.current.error).to.be.null;
    expect(result.current.representative).to.be.null;
  });

  it('testing hook state after successful api call', async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useRepresentativeStatus(),
    );

    await waitForNextUpdate();

    expect(result.current.isLoading).to.be.false;
    expect(result.current.error).to.be.null;
    expect(result.current.representative).to.not.be.null;
  });
});
