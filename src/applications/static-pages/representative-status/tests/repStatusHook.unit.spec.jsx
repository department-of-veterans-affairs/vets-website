import { expect } from 'chai';
import sinon from 'sinon';
import { renderHook } from '@testing-library/react-hooks';
import RepresentativeStatusApi from '../api/RepresentativeStatusApi';
import { useRepresentativeStatus } from '../hooks/useRepresentativeStatus';

describe('Hook', () => {
  let stub;

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
  });

  afterEach(() => {
    stub.restore();
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
