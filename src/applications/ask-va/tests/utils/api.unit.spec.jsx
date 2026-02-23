import { server } from 'platform/testing/unit/mocha-setup';
import {
  createGetHandler,
  jsonResponse,
} from 'platform/testing/unit/msw-adapter';
import { expect } from 'chai';
import { ENDPOINTS, getAllInquiries, getInquiry } from '../../utils/api';

describe('getAllInquiries', () => {
  it('calls the correct endpoint', async () => {
    server.use(
      createGetHandler(ENDPOINTS.inquiries, () =>
        jsonResponse({ key: 'success' }),
      ),
    );

    const res = await getAllInquiries();
    expect(res.key).to.equal('success');
  });
});

describe('getInquiry', () => {
  it('requests correct inquiryId', async () => {
    server.use(
      createGetHandler(`${ENDPOINTS.inquiries}/:inquiryId`, ({ params }) => {
        return jsonResponse({ data: params.inquiryId });
      }),
    );

    const resFail = await getInquiry('failure');
    expect(resFail.data).to.equal('failure');

    const resSucceed = await getInquiry('success');
    expect(resSucceed.data).to.equal('success');
  });
});
