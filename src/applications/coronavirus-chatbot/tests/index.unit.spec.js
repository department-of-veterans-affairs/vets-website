import * as WebchatModule from '../webchat';
import { initializeChatbot } from '../index';
import sinon from 'sinon';
import { expect } from 'chai';
import { mockFetch, setFetchJSONResponse } from 'platform/testing/unit/helpers';

describe('initializeChatbot', () => {
  let botConnectionStub;
  let webchatStoreStub;

  before(() => {
    botConnectionStub = sinon
      .stub(WebchatModule, 'createBotConnection')
      .returns('fake bot connection');
    webchatStoreStub = sinon
      .stub(WebchatModule, 'getWebchatStore')
      .returns('fake webchat store');
  });

  after(() => {
    botConnectionStub.restore();
    webchatStoreStub.restore();
  });

  it('should configure webchat with CSRF token', async () => {
    const mockTokenPayload = {
      locale: 'en-US',
      directLineURI: 'northamerica.directline.botframework.com',
      connectorToken: 'this-is-a-fake-token',
      userId: 'fakeUserId',
    };

    const mockJsonWebToken = `header.${btoa(
      JSON.stringify(mockTokenPayload),
    )}.signature`;

    const expectedWebchatOptions = {
      directLine: 'fake bot connection',
      store: 'fake webchat store',
    };

    mockFetch();
    setFetchJSONResponse(global.fetch.onCall(0), {
      token: mockJsonWebToken,
    });

    const webchatOptions = await initializeChatbot();

    expect(global.fetch.calledOnce).to.be.true;
    expect(webchatOptions).contains(expectedWebchatOptions);
    expect(botConnectionStub.calledWith(mockTokenPayload)).to.be.true;
    expect(
      webchatStoreStub.calledWith(mockTokenPayload.locale, mockJsonWebToken),
    ).to.be.true;
  });
});
