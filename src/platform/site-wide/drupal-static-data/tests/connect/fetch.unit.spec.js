import environment from 'platform/utilities/environment';

const sinon = require('sinon');
const { expect } = require('chai');
const { fetchDrupalStaticDataFile } = require('../../connect/fetch');

describe('fetchDrupalStaticDataFile', () => {
  let mockFetch;

  const jsonOK = body =>
    new Response(JSON.stringify(body), {
      status: 200,
      headers: {
        'Content-type': 'application/json',
      },
    });

  beforeEach(() => {
    mockFetch = sinon.stub(global, 'fetch').resolves(jsonOK(['test data']));
  });

  afterEach(() => {
    global.fetch.restore();
  });

  it('uses the environment base URL by default', async () => {
    await fetchDrupalStaticDataFile('test-file.json');

    expect(mockFetch.args[0][0]).to.have.string(environment.BASE_URL);
  });

  it('uses a custom server when given one', async () => {
    const testServer = 'https://example.com';

    await fetchDrupalStaticDataFile('test-file.json', testServer);

    expect(mockFetch.args[0][0]).to.have.string(testServer);
  });
});
