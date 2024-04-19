import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { expect } from 'chai';
import environment from '~/platform/utilities/environment';
import {
  acceptPOARequest,
  declinePOARequest,
  getPOARequestsByCodes,
} from '../../actions/poaRequests';

const prefix = `${environment.API_URL}/v0/accredited_representative_portal`;
const server = setupServer();

beforeEach(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  server.close();
});

const mockResponseData = {
  records: [
    {
      procId: '9453972527',
      type: 'powerOfAttorneyRequest',
      attributes: {
        poaCode: 'A1Q',
        secondaryStatus: 'pending',
        dateRequestReceived: '2024-03-07',
        dateRequestActioned: '2024-04-14',
        declinedReason: null,
        healthInfoAuth: 'Y',
        changeAddressAuth: 'Y',
        claimant: {
          firstName: 'Darcel',
          lastName: 'Stamm',
          city: 'Greenburgh',
          state: 'MN',
          zip: '56339',
          country: 'Guinea',
          militaryPO: null,
          militaryPostalCode: null,
          participantID: '7585030129',
          relationship: 'Child',
        },
        veteran: {
          firstName: 'Annamarie',
          lastName: 'Adams',
          middleName: 'Wolff',
          participantID: '1539825090',
          sensitivityLevel: 'Low',
        },
        VSORepresentative: {
          email: 'silvana@erdman.example',
          firstName: 'Maureen',
          lastName: 'Predovic',
        },
      },
    },
    {
      procId: '3692378881',
      type: 'powerOfAttorneyRequest',
      attributes: {
        poaCode: '091',
        secondaryStatus: 'obsolete',
        dateRequestReceived: '2024-03-18',
        dateRequestActioned: '2024-04-14',
        declinedReason: 'Consectetur facilis placeat est.',
        healthInfoAuth: 'N',
        changeAddressAuth: 'N',
        claimant: {
          firstName: 'Kelley',
          lastName: 'Bosco',
          city: 'South Vinnie',
          state: 'ME',
          zip: '16385',
          country: 'Guadeloupe',
          militaryPO: null,
          militaryPostalCode: null,
          participantID: '9156371702',
          relationship: 'Parent',
        },
        veteran: {
          firstName: 'Madelaine',
          lastName: 'Langosh',
          middleName: 'Davis',
          participantID: '4570953379',
          sensitivityLevel: 'Medium',
        },
        VSORepresentative: {
          email: 'young.tremblay@kuphal-borer.test',
          firstName: 'Ethelyn',
          lastName: 'Rath',
        },
      },
    },
  ],
  meta: {
    totalRecords: '2',
  },
};

describe('POA Request Handling', () => {
  it('handles acceptPOARequest successfully', async () => {
    server.use(
      rest.post(
        `${prefix}/v0/power_of_attorney_requests/:procId/accept`,
        (_, res, ctx) => {
          return res(ctx.json({ status: 'success' }), ctx.status(200));
        },
      ),
    );

    const response = await acceptPOARequest('12345');
    expect(response).to.eql({ status: 'success' });
  });

  it('handles declinePOARequest successfully', async () => {
    server.use(
      rest.post(
        `${prefix}/v0/power_of_attorney_requests/:procId/decline`,
        (_, res, ctx) => {
          return res(ctx.json({ status: 'success' }), ctx.status(200));
        },
      ),
    );

    const response = await declinePOARequest('12345');
    expect(response).to.eql({ status: 'success' });
  });

  it('returns an error status when the server responds with an error for accept', async () => {
    server.use(
      rest.post(
        `${prefix}/v0/power_of_attorney_requests/:procId/accept`,
        (_, res, ctx) => {
          return res(ctx.status(500));
        },
      ),
    );

    const response = await acceptPOARequest('12345');
    expect(response.status).to.equal(500);
    expect(response.statusText).to.equal('Internal Server Error');
  });

  it('returns an error status when the server responds with an error for decline', async () => {
    server.use(
      rest.post(
        `${prefix}/v0/power_of_attorney_requests/:procId/decline`,
        (_, res, ctx) => {
          return res(ctx.status(500));
        },
      ),
    );

    const response = await declinePOARequest('12345');
    expect(response.status).to.equal(500);
    expect(response.statusText).to.equal('Internal Server Error');
  });

  it('handles network errors gracefully for accept', async () => {
    server.use(
      rest.post(
        `${prefix}/v0/power_of_attorney_requests/:procId/accept`,
        (_, res, ctx) => {
          return res(ctx.status(503));
        },
      ),
    );

    const response = await acceptPOARequest('12345');
    expect(response.status).to.equal(503);
    expect(response.statusText).to.equal('Service Unavailable');
  });

  it('handles network errors gracefully for decline', async () => {
    server.use(
      rest.post(
        `${prefix}/v0/power_of_attorney_requests/:procId/decline`,
        (_, res, ctx) => {
          return res(ctx.status(503));
        },
      ),
    );

    const response = await declinePOARequest('12345');
    expect(response.status).to.equal(503);
    expect(response.statusText).to.equal('Service Unavailable');
  });
});

describe('POA Requests Retrieval', () => {
  it('retrieves POA requests successfully for multiple codes', async () => {
    const testPoaCodes = 'AB123,CD456';
    server.use(
      rest.get(`${prefix}/v0/power_of_attorney_requests`, (req, res, ctx) => {
        const queryPoaCodes = req.url.searchParams.get('poa_codes');
        if (queryPoaCodes === testPoaCodes) {
          return res(ctx.json(mockResponseData), ctx.status(200));
        }
        return res(ctx.status(404));
      }),
    );

    const response = await getPOARequestsByCodes(testPoaCodes);
    expect(response.records).to.deep.equal(mockResponseData.records);
    expect(response.meta.totalRecords).to.equal(
      mockResponseData.meta.totalRecords,
    );
  });

  it('returns an error status when the server responds with an error', async () => {
    server.use(
      rest.get(`${prefix}/v0/power_of_attorney_requests`, (_, res, ctx) => {
        return res(ctx.status(500));
      }),
    );

    const response = await getPOARequestsByCodes('AB123');
    expect(response.status).to.equal(500);
    expect(response.statusText).to.equal('Internal Server Error');
  });

  it('handles network errors gracefully', async () => {
    server.use(
      rest.get(`${prefix}/v0/power_of_attorney_requests`, (_, res, ctx) => {
        return res(ctx.status(503));
      }),
    );

    const response = await getPOARequestsByCodes('AB123');
    expect(response.status).to.equal(503);
    expect(response.statusText).to.equal('Service Unavailable');
  });
});
